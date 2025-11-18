import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell, Clock, Repeat, Timer, Info } from 'lucide-react';
import { Button } from './Button';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
}

interface WorkoutDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  workout: {
    day: string;
    focus: string;
    exercises: Exercise[];
    duration: string;
    warmup?: string;
    cooldown?: string;
  };
}

export const WorkoutDetailsModal: React.FC<WorkoutDetailsModalProps> = ({
  isOpen,
  onClose,
  workout,
}) => {
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden my-8"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>

              {/* Header */}
              <div className="bg-gradient-to-br from-primary to-primary-dark p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm">
                    <Dumbbell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white">
                      {workout.day}
                    </h2>
                    <p className="text-white/80 text-sm">
                      {workout.focus}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-white/90 text-sm mt-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{workout.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Dumbbell className="w-4 h-4" />
                    <span>{workout.exercises.length} exercises</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
                {/* Warm-up */}
                {workout.warmup && (
                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                      <Timer className="w-4 h-4" />
                      Warm-up
                    </h3>
                    <p className="text-sm text-blue-800 dark:text-blue-400">
                      {workout.warmup}
                    </p>
                  </div>
                )}

                {/* Exercises */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-3">
                    Exercises
                  </h3>
                  {workout.exercises.map((exercise, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                            {index + 1}
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {exercise.name}
                          </h4>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Repeat className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Sets</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {exercise.sets}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Dumbbell className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Reps</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {exercise.reps}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Timer className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Rest</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {exercise.rest}
                            </p>
                          </div>
                        </div>
                      </div>

                      {exercise.notes && (
                        <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400 mt-2 p-2 bg-white dark:bg-gray-900 rounded">
                          <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <p>{exercise.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Cool-down */}
                {workout.cooldown && (
                  <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-2 flex items-center gap-2">
                      <Timer className="w-4 h-4" />
                      Cool-down
                    </h3>
                    <p className="text-sm text-purple-800 dark:text-purple-400">
                      {workout.cooldown}
                    </p>
                  </div>
                )}

                {/* Coach Note */}
                <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-sm text-amber-800 dark:text-amber-400">
                    <strong>Coach's Note:</strong> Focus on proper form over heavy weight. Listen to your body and adjust as needed. Don't forget to stay hydrated!
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" fullWidth onClick={onClose}>
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => {
                      alert('Workout tracking feature coming soon!');
                    }}
                  >
                    Start Workout
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

