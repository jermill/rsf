import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Trash2,
  Send,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Post, Comment } from '../../hooks/useCommunity';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onUnlike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onDelete: (postId: string) => void;
  onGetComments: (postId: string) => Promise<Comment[]>;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onUnlike,
  onComment,
  onDelete,
  onGetComments,
}) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleLike = () => {
    if (post.is_liked_by_user) {
      onUnlike(post.id);
    } else {
      onLike(post.id);
    }
  };

  const handleShowComments = async () => {
    if (!showComments) {
      setLoadingComments(true);
      const fetchedComments = await onGetComments(post.id);
      setComments(fetchedComments);
      setLoadingComments(false);
    }
    setShowComments(!showComments);
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;

    await onComment(post.id, commentText);
    setCommentText('');

    // Refresh comments
    const fetchedComments = await onGetComments(post.id);
    setComments(fetchedComments);
  };

  return (
    <Card className="overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      {/* Post Header */}
      <div className="p-4 sm:p-6 bg-white dark:bg-gray-900">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold overflow-hidden">
              {post.user_avatar ? (
                <img
                  src={post.user_avatar}
                  alt={post.user_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                post.user_name[0]?.toUpperCase()
              )}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {post.user_name}
              </h4>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>

          {user?.id === post.user_id && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <MoreHorizontal className="w-5 h-5 text-gray-500" />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10"
                  >
                    <button
                      onClick={() => {
                        onDelete(post.id);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-left text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Post
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Post Content */}
        {post.content && (
          <p className="text-gray-900 dark:text-white mb-4 whitespace-pre-wrap">
            {post.content}
          </p>
        )}
      </div>

      {/* Post Images */}
      {post.images && post.images.length > 0 && (
        <div
          className={cn(
            'grid gap-1',
            post.images.length === 1 && 'grid-cols-1',
            post.images.length === 2 && 'grid-cols-2',
            post.images.length === 3 && 'grid-cols-3',
            post.images.length >= 4 && 'grid-cols-2'
          )}
        >
          {post.images.slice(0, 4).map((image, index) => (
            <div
              key={index}
              className={cn(
                'relative aspect-square overflow-hidden',
                post.images.length === 1 && 'aspect-video'
              )}
            >
              <img
                src={image}
                alt={`Post image ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              {index === 3 && post.images.length > 4 && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    +{post.images.length - 4}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Post Stats */}
      <div className="px-4 sm:px-6 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1">
            {post.likes_count > 0 && (
              <>
                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                {post.likes_count}
              </>
            )}
          </span>
          <button
            onClick={handleShowComments}
            className="hover:underline"
          >
            {post.comments_count} {post.comments_count === 1 ? 'comment' : 'comments'}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 sm:px-6 py-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-around">
          <button
            onClick={handleLike}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors flex-1 justify-center',
              post.is_liked_by_user
                ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            <Heart
              className={cn(
                'w-5 h-5',
                post.is_liked_by_user && 'fill-current'
              )}
            />
            <span className="font-medium text-sm sm:text-base">Like</span>
          </button>

          <button
            onClick={handleShowComments}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-1 justify-center"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium text-sm sm:text-base">Comment</span>
          </button>

          <button
            disabled
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-1 justify-center opacity-50 cursor-not-allowed"
          >
            <Share2 className="w-5 h-5" />
            <span className="font-medium text-sm sm:text-base hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-4 sm:p-6 space-y-4 max-h-96 overflow-y-auto">
              {loadingComments ? (
                <div className="text-center text-gray-500 py-4">
                  Loading comments...
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  No comments yet. Be the first to comment!
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/70 to-primary/50 flex items-center justify-center text-white text-sm font-bold overflow-hidden flex-shrink-0">
                      {comment.user_avatar ? (
                        <img
                          src={comment.user_avatar}
                          alt={comment.user_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        comment.user_name?.[0]?.toUpperCase()
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2">
                        <h5 className="font-semibold text-sm text-gray-900 dark:text-white">
                          {comment.user_name}
                        </h5>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {comment.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 mt-1 px-4">
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.created_at), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input */}
            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-sm font-bold overflow-hidden flex-shrink-0">
                  {user?.email?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                    placeholder="Write a comment..."
                    className="flex-1 px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  />
                  <button
                    onClick={handleSubmitComment}
                    disabled={!commentText.trim()}
                    className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

