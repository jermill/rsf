import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Calendar, Target, X, TrendingUp } from 'lucide-react';
import { Button } from './Button';

interface GoalReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: {
    id: string;
    title: string;
    target: string;
    current: string;
    progress: number;
    deadline: string;
  };
  onReview: (goalId: string, achieved: boolean, action: 'archive' | 'extend' | 'revise') => void;
}

export const GoalReviewModal: React.FC<GoalReviewModalProps> = ({
  isOpen,
  onClose,
  goal,
  onReview,
}) => {
  const [step, setStep] = useState<'review' | 'action'>('review');
  const [achieved, setAchieved] = useState<boolean | null>(null);
  const [newDeadline, setNewDeadline] = useState('');

  const handleAchieved = (value: boolean) => {
    setAchieved(value);
    setStep('action');
  };

  const handleAction = (action: 'archive' | 'extend' | 'revise') => {
    if (achieved !== null) {
      onReview(goal.id, achieved, action);
      onClose();
      // Reset state
      setStep('review');
      setAchieved(null);
      setNewDeadline('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>

              {/* Header */}
              <div className="bg-gradient-to-br from-primary to-primary-dark p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-3">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-display font-bold text-white mb-1">
                  Review Your Goal
                </h2>
                <p className="text-white/80 text-sm">
                  Deadline has passed - let's check your progress
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Goal Details */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    {goal.title}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Target:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{goal.target}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Current:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{goal.current}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Progress:</span>
                      <span className="font-semibold text-primary">{goal.progress}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Deadline:</span>
                      <span className="font-semibold text-red-500">{goal.deadline} (Passed)</span>
                    </div>
                  </div>
                </div>

                {/* Step 1: Achievement Review */}
                {step === 'review' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <p className="text-center text-gray-700 dark:text-gray-300 mb-4">
                      Did you achieve this goal?
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => handleAchieved(true)}
                        className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-green-500 bg-green-500/10 hover:bg-green-500/20 transition-all group"
                      >
                        <CheckCircle className="w-12 h-12 text-green-500 group-hover:scale-110 transition-transform" />
                        <div className="text-center">
                          <p className="font-bold text-gray-900 dark:text-white">Yes! ✨</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Goal Achieved</p>
                        </div>
                      </button>
                      <button
                        onClick={() => handleAchieved(false)}
                        className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-orange-500 bg-orange-500/10 hover:bg-orange-500/20 transition-all group"
                      >
                        <XCircle className="w-12 h-12 text-orange-500 group-hover:scale-110 transition-transform" />
                        <div className="text-center">
                          <p className="font-bold text-gray-900 dark:text-white">Not Yet</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Need More Time</p>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Action Selection */}
                {step === 'action' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {achieved ? (
                      <>
                        <div className="text-center mb-4">
                          <p className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
                            🎉 Congratulations!
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            What would you like to do with this goal?
                          </p>
                        </div>
                        <div className="space-y-3">
                          <button
                            onClick={() => handleAction('archive')}
                            className="w-full p-4 text-left rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary transition-all"
                          >
                            <p className="font-semibold text-gray-900 dark:text-white mb-1">
                              ✅ Archive Goal
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Mark as complete and move to history
                            </p>
                          </button>
                          <button
                            onClick={() => handleAction('revise')}
                            className="w-full p-4 text-left rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary transition-all"
                          >
                            <p className="font-semibold text-gray-900 dark:text-white mb-1">
                              🎯 Set New Goal
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Create a new challenging target
                            </p>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center mb-4">
                          <p className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-2">
                            Keep Going! 💪
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            What would you like to do next?
                          </p>
                        </div>
                        <div className="space-y-3">
                          <button
                            onClick={() => handleAction('extend')}
                            className="w-full p-4 text-left rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary transition-all"
                          >
                            <div className="flex items-start gap-3">
                              <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white mb-1">
                                  📅 Extend Deadline
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                  Give yourself more time to reach this goal
                                </p>
                                <input
                                  type="date"
                                  value={newDeadline}
                                  onChange={(e) => setNewDeadline(e.target.value)}
                                  min={new Date().toISOString().split('T')[0]}
                                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            </div>
                          </button>
                          <button
                            onClick={() => handleAction('revise')}
                            className="w-full p-4 text-left rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary transition-all"
                          >
                            <div className="flex items-start gap-3">
                              <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white mb-1">
                                  🎯 Revise Goal
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  Adjust the target or create a new goal
                                </p>
                              </div>
                            </div>
                          </button>
                          <button
                            onClick={() => handleAction('archive')}
                            className="w-full p-4 text-left rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-red-500 transition-all"
                          >
                            <p className="font-semibold text-gray-900 dark:text-white mb-1">
                              ❌ Archive Goal
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Remove from active goals (not recommended)
                            </p>
                          </button>
                        </div>
                      </>
                    )}

                    <Button
                      variant="ghost"
                      fullWidth
                      onClick={() => {
                        setStep('review');
                        setAchieved(null);
                      }}
                      className="mt-4"
                    >
                      ← Back
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

