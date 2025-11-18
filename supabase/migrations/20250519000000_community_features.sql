-- =====================================================
-- Community Features - Social Feed System
-- Created: 2025-11-17
-- Description: Facebook-style community feed with posts, comments, likes
-- =====================================================

-- Posts table (main feed content)
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Post content
  content TEXT,
  post_type TEXT DEFAULT 'post' CHECK (post_type IN ('post', 'workout', 'progress', 'milestone')),
  
  -- Media
  images TEXT[], -- Array of image URLs
  video_url TEXT,
  
  -- Engagement
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  
  -- Visibility
  is_public BOOLEAN DEFAULT TRUE,
  is_pinned BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  tags TEXT[],
  location TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Post likes
CREATE TABLE IF NOT EXISTS community_post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(post_id, user_id)
);

-- Post comments
CREATE TABLE IF NOT EXISTS community_post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  parent_comment_id UUID REFERENCES community_post_comments(id) ON DELETE CASCADE,
  
  -- Comment content
  content TEXT NOT NULL,
  image_url TEXT,
  
  -- Engagement
  likes_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Comment likes
CREATE TABLE IF NOT EXISTS community_comment_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID REFERENCES community_post_comments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(comment_id, user_id)
);

-- User following/friends
CREATE TABLE IF NOT EXISTS community_follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Notifications for community activity
CREATE TABLE IF NOT EXISTS community_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Notification details
  notification_type TEXT NOT NULL, -- 'like', 'comment', 'follow', 'mention'
  content TEXT,
  
  -- Related entities
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES community_post_comments(id) ON DELETE CASCADE,
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_community_posts_user ON community_posts(user_id);
CREATE INDEX idx_community_posts_created ON community_posts(created_at DESC);
CREATE INDEX idx_community_posts_type ON community_posts(post_type);
CREATE INDEX idx_community_posts_deleted ON community_posts(deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX idx_post_likes_post ON community_post_likes(post_id);
CREATE INDEX idx_post_likes_user ON community_post_likes(user_id);

CREATE INDEX idx_post_comments_post ON community_post_comments(post_id);
CREATE INDEX idx_post_comments_user ON community_post_comments(user_id);
CREATE INDEX idx_post_comments_parent ON community_post_comments(parent_comment_id);
CREATE INDEX idx_post_comments_created ON community_post_comments(created_at DESC);

CREATE INDEX idx_comment_likes_comment ON community_comment_likes(comment_id);
CREATE INDEX idx_comment_likes_user ON community_comment_likes(user_id);

CREATE INDEX idx_follows_follower ON community_follows(follower_id);
CREATE INDEX idx_follows_following ON community_follows(following_id);

CREATE INDEX idx_notifications_user ON community_notifications(user_id);
CREATE INDEX idx_notifications_read ON community_notifications(is_read);
CREATE INDEX idx_notifications_created ON community_notifications(created_at DESC);

-- Enable Row Level Security
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for posts
CREATE POLICY "Public posts are viewable by everyone"
  ON community_posts FOR SELECT
  USING (is_public = TRUE AND deleted_at IS NULL);

CREATE POLICY "Users can view own posts"
  ON community_posts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own posts"
  ON community_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON community_posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON community_posts FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for post likes
CREATE POLICY "Post likes are viewable by everyone"
  ON community_post_likes FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can like posts"
  ON community_post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON community_post_likes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for comments
CREATE POLICY "Comments are viewable by everyone"
  ON community_post_comments FOR SELECT
  USING (deleted_at IS NULL);

CREATE POLICY "Users can create comments"
  ON community_post_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON community_post_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON community_post_comments FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for comment likes
CREATE POLICY "Comment likes are viewable by everyone"
  ON community_comment_likes FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can like comments"
  ON community_comment_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike comments"
  ON community_comment_likes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for follows
CREATE POLICY "Follows are viewable by everyone"
  ON community_follows FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can follow others"
  ON community_follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
  ON community_follows FOR DELETE
  USING (auth.uid() = follower_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications"
  ON community_notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON community_notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to increment likes count
CREATE OR REPLACE FUNCTION increment_post_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_posts
  SET likes_count = likes_count + 1
  WHERE id = NEW.post_id;
  
  -- Create notification
  INSERT INTO community_notifications (user_id, actor_id, notification_type, post_id, content)
  SELECT 
    cp.user_id,
    NEW.user_id,
    'like',
    NEW.post_id,
    'liked your post'
  FROM community_posts cp
  WHERE cp.id = NEW.post_id
    AND cp.user_id != NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_post_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_posts
  SET likes_count = GREATEST(0, likes_count - 1)
  WHERE id = OLD.post_id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment comments count
CREATE OR REPLACE FUNCTION increment_post_comments()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_posts
  SET comments_count = comments_count + 1
  WHERE id = NEW.post_id;
  
  -- Create notification
  INSERT INTO community_notifications (user_id, actor_id, notification_type, post_id, comment_id, content)
  SELECT 
    cp.user_id,
    NEW.user_id,
    'comment',
    NEW.post_id,
    NEW.id,
    'commented on your post'
  FROM community_posts cp
  WHERE cp.id = NEW.post_id
    AND cp.user_id != NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_post_comments()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_posts
  SET comments_count = GREATEST(0, comments_count - 1)
  WHERE id = OLD.post_id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for like counts
DROP TRIGGER IF EXISTS trigger_increment_post_likes ON community_post_likes;
CREATE TRIGGER trigger_increment_post_likes
  AFTER INSERT ON community_post_likes
  FOR EACH ROW
  EXECUTE FUNCTION increment_post_likes();

DROP TRIGGER IF EXISTS trigger_decrement_post_likes ON community_post_likes;
CREATE TRIGGER trigger_decrement_post_likes
  AFTER DELETE ON community_post_likes
  FOR EACH ROW
  EXECUTE FUNCTION decrement_post_likes();

-- Triggers for comment counts
DROP TRIGGER IF EXISTS trigger_increment_post_comments ON community_post_comments;
CREATE TRIGGER trigger_increment_post_comments
  AFTER INSERT ON community_post_comments
  FOR EACH ROW
  EXECUTE FUNCTION increment_post_comments();

DROP TRIGGER IF EXISTS trigger_decrement_post_comments ON community_post_comments;
CREATE TRIGGER trigger_decrement_post_comments
  AFTER DELETE ON community_post_comments
  FOR EACH ROW
  EXECUTE FUNCTION decrement_post_comments();

-- Update timestamp trigger
DROP TRIGGER IF EXISTS update_community_posts_updated_at ON community_posts;
CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON community_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_community_post_comments_updated_at ON community_post_comments;
CREATE TRIGGER update_community_post_comments_updated_at
  BEFORE UPDATE ON community_post_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to get feed posts with user info
CREATE OR REPLACE FUNCTION get_community_feed(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  user_name TEXT,
  user_avatar TEXT,
  content TEXT,
  post_type TEXT,
  images TEXT[],
  video_url TEXT,
  likes_count INTEGER,
  comments_count INTEGER,
  is_liked_by_user BOOLEAN,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cp.id,
    cp.user_id,
    COALESCE(p.first_name || ' ' || p.last_name, 'Anonymous') as user_name,
    p.avatar_url as user_avatar,
    cp.content,
    cp.post_type,
    cp.images,
    cp.video_url,
    cp.likes_count,
    cp.comments_count,
    EXISTS(
      SELECT 1 FROM community_post_likes
      WHERE post_id = cp.id AND user_id = p_user_id
    ) as is_liked_by_user,
    cp.created_at
  FROM community_posts cp
  LEFT JOIN profiles p ON cp.user_id = p.id
  WHERE cp.deleted_at IS NULL
    AND cp.is_public = TRUE
  ORDER BY cp.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT ALL ON community_posts TO authenticated;
GRANT ALL ON community_post_likes TO authenticated;
GRANT ALL ON community_post_comments TO authenticated;
GRANT ALL ON community_comment_likes TO authenticated;
GRANT ALL ON community_follows TO authenticated;
GRANT ALL ON community_notifications TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Community features created successfully!';
  RAISE NOTICE '📱 New tables: posts, likes, comments, follows, notifications';
  RAISE NOTICE '🚀 Functions: get_community_feed() for optimized feed loading';
END $$;

