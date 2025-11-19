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
    <div className="min-h-screen pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-20 bg-gray-50 dark:bg-gray-950">
      <Section className="!py-0 !bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-7 md:mb-8"
          >
            <div className="flex items-start sm:items-center justify-between mb-2 sm:mb-3 gap-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                Community Feed
              </h1>
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2.5 sm:p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors touch-manipulation active:scale-95"
                  aria-label="Toggle dark mode"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-700" />
                  )}
                </button>
                <div className="hidden sm:flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm font-medium">
                    {posts.length} posts
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              Share your progress, connect with others, and celebrate wins together! 🎉
            </p>
            {/* Mobile post count */}
            <div className="sm:hidden flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-2">
              <Users className="w-4 h-4" />
              <span className="text-xs font-medium">
                {posts.length} posts
              </span>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                <span className="text-xs text-gray-600 dark:text-gray-400 truncate">Members</span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {posts.length > 0 ? new Set(posts.map(p => p.user_id)).size : 0}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" />
                <span className="text-xs text-gray-600 dark:text-gray-400 truncate">Likes</span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {posts.reduce((sum, post) => sum + post.likes_count, 0)}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                <span className="text-xs text-gray-600 dark:text-gray-400 truncate">Comments</span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {posts.reduce((sum, post) => sum + post.comments_count, 0)}
              </p>
            </div>
          </motion.div>

          {/* Create Post */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4 sm:mb-5 md:mb-6"
          >
            {user ? (
              <CreatePost onPostCreated={createPost} />
            ) : (
              <div className="bg-gradient-to-r from-primary/90 to-primary dark:from-primary/80 dark:to-primary/90 rounded-xl p-4 sm:p-5 md:p-6 text-center shadow-lg border border-primary/20">
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-white">Join the Community!</h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  Sign in to share your fitness journey, connect with others, and get inspired! 💪
                </p>
                <button
                  onClick={() => navigate('/onboarding')}
                  className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-5 sm:px-6 py-2.5 sm:py-2 rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-all shadow-lg border-2 border-gray-900 dark:border-white touch-manipulation w-full sm:w-auto"
                >
                  Join Community
                </button>
              </div>
            )}
          </motion.div>

          {/* Posts Feed */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {posts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 sm:py-14 md:py-16"
              >
                <Users className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No posts yet
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
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
                    transition={{ delay: Math.min(index * 0.1, 0.5) }}
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
                  <div className="text-center py-6 sm:py-7 md:py-8">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation w-full sm:w-auto"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
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