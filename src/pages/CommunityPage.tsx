import { motion } from 'framer-motion';
import { Users, TrendingUp, Heart, MessageCircle, Loader2, Moon, Sun } from 'lucide-react';
import { Section } from '../components/ui/Section';
import { CreatePost } from '../components/community/CreatePost';
import { PostCard } from '../components/community/PostCard';
import { useCommunity } from '../hooks/useCommunity';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const CommunityPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const {
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
  } = useCommunity();

  // Show loading spinner while checking auth or loading posts
  if (authLoading || (loading && posts.length === 0)) {
    return <LoadingSpinner fullScreen message="Loading community feed..." />;
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50 dark:bg-gray-950">
      <Section className="!py-0 !bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Community Feed
              </h1>
              <div className="flex items-center gap-4">
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-700" />
                  )}
                </button>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Users className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {posts.length} posts
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Share your progress, connect with others, and celebrate wins together! 🎉
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4 mb-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Members</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {posts.length > 0 ? new Set(posts.map(p => p.user_id)).size : 0}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Likes</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {posts.reduce((sum, post) => sum + post.likes_count, 0)}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <MessageCircle className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Comments</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {posts.reduce((sum, post) => sum + post.comments_count, 0)}
              </p>
            </div>
          </motion.div>

          {/* Create Post */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            {user ? (
              <CreatePost onPostCreated={createPost} />
            ) : (
              <div className="bg-gradient-to-r from-primary/90 to-primary dark:from-primary/80 dark:to-primary/90 rounded-xl p-6 text-center shadow-lg border border-primary/20">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Join the Community!</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Sign in to share your fitness journey, connect with others, and get inspired! 💪
                </p>
                <button
                  onClick={() => navigate('/onboarding')}
                  className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-lg border-2 border-gray-900 dark:border-white"
                >
                  Join Community
                </button>
              </div>
            )}
          </motion.div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Be the first to share your fitness journey!
                </p>
              </motion.div>
            ) : (
              <>
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PostCard
                      post={post}
                      onLike={likePost}
                      onUnlike={unlikePost}
                      onComment={addComment}
                      onDelete={deletePost}
                      onGetComments={getComments}
                    />
                  </motion.div>
                ))}

                {/* Load More */}
                {hasMore && (
                  <div className="text-center py-8">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-5 h-5" />
                          Load More Posts
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default CommunityPage;