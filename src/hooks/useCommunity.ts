import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { handleError } from '../utils/errorHandler';
import { trackEvent } from '../lib/analytics';

export interface Post {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string | null;
  content: string | null;
  post_type: 'post' | 'workout' | 'progress' | 'milestone';
  images: string[];
  video_url: string | null;
  likes_count: number;
  comments_count: number;
  is_liked_by_user: boolean;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_comment_id: string | null;
  content: string;
  image_url: string | null;
  likes_count: number;
  created_at: string;
  user_name?: string;
  user_avatar?: string | null;
}

export const useCommunity = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPosts();
      subscribeToNewPosts();
    } else {
      // If no user, stop loading
      setLoading(false);
    }
  }, [user]);

  const fetchPosts = async (offset = 0) => {
    if (!user) return;

    try {
      setLoading(true);

      // Try RPC function first
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('get_community_feed', {
          p_user_id: user.id,
          p_limit: 20,
          p_offset: offset,
        });

      if (!rpcError && rpcData) {
        if (offset === 0) {
          setPosts(rpcData || []);
        } else {
          setPosts(prev => [...prev, ...(rpcData || [])]);
        }
        setHasMore((rpcData || []).length === 20);
      } else {
        console.warn('RPC function failed, using direct query fallback:', rpcError);
        
        // Fallback: Direct query with separate profile fetch
        const { data: posts, error: postsError } = await supabase
          .from('community_posts')
          .select('*')
          .is('deleted_at', null)
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .range(offset, offset + 19);

        if (postsError) throw postsError;

        // Fetch profiles separately
        const userIds = [...new Set((posts || []).map((p: any) => p.user_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url')
          .in('id', userIds);

        const profileMap = (profiles || []).reduce((acc: any, profile: any) => {
          acc[profile.id] = profile;
          return acc;
        }, {});

        // Transform data to match RPC function output
        const transformedPosts = (posts || []).map((post: any) => {
          const profile = profileMap[post.user_id] || {};
          return {
            id: post.id,
            user_id: post.user_id,
            user_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous',
            user_avatar: profile.avatar_url || null,
            content: post.content,
            post_type: post.post_type,
            images: post.images || [],
            video_url: post.video_url,
            likes_count: post.likes_count || 0,
            comments_count: post.comments_count || 0,
            is_liked_by_user: false, // TODO: Check if user liked
            created_at: post.created_at,
          };
        });

        if (offset === 0) {
          setPosts(transformedPosts);
        } else {
          setPosts(prev => [...prev, ...transformedPosts]);
        }

        setHasMore(transformedPosts.length === 20);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      handleError(error, {
        customMessage: 'Failed to load community feed',
      });
    } finally {
      setLoading(false);
    }
  };

  const subscribeToNewPosts = () => {
    const subscription = supabase
      .channel('community_posts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_posts',
        },
        () => {
          // Refresh feed when new post is created
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const createPost = async (data: {
    content?: string;
    images?: string[];
    post_type?: string;
  }) => {
    if (!user) {
      console.error('No user found when creating post');
      return null;
    }

    try {
      console.log('Creating post in Supabase with:', {
        user_id: user.id,
        content: data.content,
        images: data.images || [],
        post_type: data.post_type || 'post',
      });

      const { data: newPost, error } = await supabase
        .from('community_posts')
        .insert({
          user_id: user.id,
          content: data.content,
          images: data.images || [],
          post_type: data.post_type || 'post',
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating post:', error);
        throw error;
      }

      console.log('Post created successfully:', newPost);

      trackEvent('community_post_created', {
        post_type: data.post_type,
        has_images: (data.images || []).length > 0,
      });

      // Refresh feed
      await fetchPosts();
      return newPost;
    } catch (error) {
      console.error('Error in createPost:', error);
      handleError(error, {
        customMessage: 'Failed to create post',
      });
      return null;
    }
  };

  const likePost = async (postId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('community_post_likes')
        .insert({
          post_id: postId,
          user_id: user.id,
        });

      if (error) throw error;

      // Update local state
      setPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? {
                ...post,
                likes_count: post.likes_count + 1,
                is_liked_by_user: true,
              }
            : post
        )
      );

      trackEvent('community_post_liked', { post_id: postId });
      return true;
    } catch (error) {
      handleError(error, {
        customMessage: 'Failed to like post',
        showToUser: false,
      });
      return false;
    }
  };

  const unlikePost = async (postId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('community_post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? {
                ...post,
                likes_count: Math.max(0, post.likes_count - 1),
                is_liked_by_user: false,
              }
            : post
        )
      );

      return true;
    } catch (error) {
      handleError(error, {
        customMessage: 'Failed to unlike post',
        showToUser: false,
      });
      return false;
    }
  };

  const getComments = async (postId: string) => {
    try {
      // Fetch comments
      const { data: comments, error } = await supabase
        .from('community_post_comments')
        .select('*')
        .eq('post_id', postId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (!comments || comments.length === 0) {
        return [];
      }

      // Fetch profiles separately
      const userIds = [...new Set(comments.map((c: any) => c.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', userIds);

      const profileMap = (profiles || []).reduce((acc: any, profile: any) => {
        acc[profile.id] = profile;
        return acc;
      }, {});

      // Map comments with profile data
      const mappedComments: Comment[] = comments.map((comment: any) => {
        const profile = profileMap[comment.user_id] || {};
        return {
          id: comment.id,
          post_id: comment.post_id,
          user_id: comment.user_id,
          parent_comment_id: comment.parent_comment_id,
          content: comment.content,
          image_url: comment.image_url,
          likes_count: comment.likes_count || 0,
          created_at: comment.created_at,
          user_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous',
          user_avatar: profile.avatar_url || null,
        };
      });

      return mappedComments;
    } catch (error) {
      console.error('Error fetching comments:', error);
      handleError(error, {
        customMessage: 'Failed to load comments',
      });
      return [];
    }
  };

  const addComment = async (postId: string, content: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('community_post_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content,
        })
        .select()
        .single();

      if (error) throw error;

      // Update local post comments count
      setPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? { ...post, comments_count: post.comments_count + 1 }
            : post
        )
      );

      trackEvent('community_comment_added', { post_id: postId });
      return data;
    } catch (error) {
      handleError(error, {
        customMessage: 'Failed to add comment',
      });
      return null;
    }
  };

  const deletePost = async (postId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('community_posts')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', postId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Remove from local state
      setPosts(prev => prev.filter(post => post.id !== postId));

      trackEvent('community_post_deleted', { post_id: postId });
      return true;
    } catch (error) {
      handleError(error, {
        customMessage: 'Failed to delete post',
      });
      return false;
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(posts.length);
    }
  };

  return {
    posts,
    loading,
    hasMore,
    createPost,
    likePost,
    unlikePost,
    getComments,
    addComment,
    deletePost,
    loadMore,
    refresh: () => fetchPosts(),
  };
};

