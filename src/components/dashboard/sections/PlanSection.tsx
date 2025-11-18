import React, { useState } from 'react';
import { Target, Utensils, Dumbbell, Crown, CheckCircle2, Calendar, AlertCircle } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { GoalReviewModal } from '../../ui/GoalReviewModal';
import { WorkoutDetailsModal } from '../../ui/WorkoutDetailsModal';

interface Goal {
  id: string;
  title: string;
  target: string;
  current: string;
  progress: number;
  deadline: string;
}

const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Reach Target Weight',
    target: '175 lbs',
    current: '176 lbs',
    progress: 90,
    deadline: 'Nov 1, 2025', // Past deadline for testing
  },
  {
    id: '2',
    title: 'Complete 50 Sessions',
    target: '50 sessions',
    current: '24 sessions',
    progress: 48,
    deadline: 'Dec 31, 2025',
  },
  {
    id: '3',
    title: 'Increase Chest Size',
    target: '44 inches',
    current: '43.5 inches',
    progress: 88,
    deadline: 'Jan 15, 2026',
  },
];

const workoutPlan = [
  { 
    day: 'Monday', 
    focus: 'Chest & Triceps', 
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, reps: '8-10', rest: '90 sec', notes: 'Focus on controlled descent' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '60 sec' },
      { name: 'Cable Flyes', sets: 3, reps: '12-15', rest: '45 sec', notes: 'Squeeze at the peak contraction' },
      { name: 'Tricep Dips', sets: 3, reps: '8-12', rest: '60 sec' },
      { name: 'Overhead Tricep Extension', sets: 3, reps: '12-15', rest: '45 sec' },
    ],
    duration: '60 min',
    warmup: '5-10 min cardio + dynamic stretching (arm circles, band pull-aparts)',
    cooldown: '5-10 min stretching (chest, triceps, shoulders)'
  },
  { 
    day: 'Wednesday', 
    focus: 'Back & Biceps', 
    exercises: [
      { name: 'Deadlifts', sets: 4, reps: '6-8', rest: '2 min', notes: 'Keep back straight, engage core' },
      { name: 'Pull-ups / Lat Pulldowns', sets: 4, reps: '8-12', rest: '90 sec' },
      { name: 'Barbell Rows', sets: 3, reps: '10-12', rest: '60 sec' },
      { name: 'Seated Cable Rows', sets: 3, reps: '12-15', rest: '60 sec' },
      { name: 'Barbell Bicep Curls', sets: 3, reps: '10-12', rest: '45 sec' },
      { name: 'Hammer Curls', sets: 3, reps: '12-15', rest: '45 sec' },
    ],
    duration: '60 min',
    warmup: '5-10 min rowing machine + dynamic stretching',
    cooldown: '5-10 min stretching (back, biceps, hamstrings)'
  },
  { 
    day: 'Friday', 
    focus: 'Legs & Core', 
    exercises: [
      { name: 'Back Squats', sets: 4, reps: '8-10', rest: '2 min', notes: 'Go below parallel if mobility allows' },
      { name: 'Romanian Deadlifts', sets: 3, reps: '10-12', rest: '90 sec' },
      { name: 'Leg Press', sets: 3, reps: '12-15', rest: '60 sec' },
      { name: 'Walking Lunges', sets: 3, reps: '12 each leg', rest: '60 sec' },
      { name: 'Leg Curls', sets: 3, reps: '12-15', rest: '45 sec' },
      { name: 'Planks', sets: 3, reps: '45-60 sec', rest: '45 sec' },
      { name: 'Russian Twists', sets: 3, reps: '20 each side', rest: '45 sec' },
    ],
    duration: '75 min',
    warmup: '5-10 min bike + leg swings, bodyweight squats',
    cooldown: '5-10 min stretching (quads, hamstrings, hip flexors, glutes)'
  },
  { 
    day: 'Saturday', 
    focus: 'Flex & Mobility', 
    exercises: [
      { name: 'Foam Rolling - Full Body', sets: 1, reps: '10 min', rest: 'N/A', notes: 'Focus on tight areas' },
      { name: 'Dynamic Stretching', sets: 1, reps: '10 min', rest: 'N/A' },
      { name: 'Yoga Flow Sequence', sets: 1, reps: '15 min', rest: 'N/A' },
      { name: 'Static Stretching', sets: 1, reps: '10 min', rest: 'N/A', notes: 'Hold each stretch 30-60 seconds' },
    ],
    duration: '45 min',
    warmup: 'Light movement and breathing exercises',
    cooldown: 'Deep breathing and meditation (5 min)'
  },
];

const mealPlan = [
  { meal: 'Breakfast', time: '8:00 AM', calories: 450, description: 'Oatmeal with berries & protein shake' },
  { meal: 'Snack', time: '11:00 AM', calories: 200, description: 'Greek yogurt & almonds' },
  { meal: 'Lunch', time: '1:00 PM', calories: 600, description: 'Grilled chicken salad with quinoa' },
  { meal: 'Snack', time: '4:00 PM', calories: 150, description: 'Apple with peanut butter' },
  { meal: 'Dinner', time: '7:00 PM', calories: 650, description: 'Salmon, sweet potato & vegetables' },
];

export const PlanSection: React.FC = () => {
  const totalCalories = mealPlan.reduce((sum, meal) => sum + meal.calories, 0);
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<typeof workoutPlan[0] | null>(null);
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);

  const isDeadlinePassed = (deadline: string): boolean => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return deadlineDate < today;
  };

  const handleReviewGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsReviewModalOpen(true);
  };

  const handleGoalReview = (goalId: string, achieved: boolean, action: 'archive' | 'extend' | 'revise') => {
    console.log('Goal reviewed:', { goalId, achieved, action });
    
    if (action === 'archive') {
      // Remove goal from active list
      setGoals(prevGoals => prevGoals.filter(g => g.id !== goalId));
      
      const message = achieved 
        ? '🎉 Congratulations! Goal achieved and archived!'
        : '📋 Goal archived. Keep up the great work!';
      
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(null), 5000); // Hide after 5 seconds
    } else if (action === 'extend') {
      // Update deadline (in a real app, you'd set a new date)
      setGoals(prevGoals => 
        prevGoals.map(g => 
          g.id === goalId 
            ? { ...g, deadline: 'Jan 31, 2026' } // Example new deadline
            : g
        )
      );
      
      setSuccessMessage('📅 Goal deadline extended! Keep pushing towards your target!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } else if (action === 'revise') {
      // In a real app, open a form to edit the goal
      setSuccessMessage('🎯 Goal revision - Coming soon!');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
    
    // TODO: Save to Supabase
    // - Update goal status in database
    // - Archive or extend deadline
    // - Log achievement history
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
          <p className="text-green-800 dark:text-green-300 font-medium flex-1">
            {successMessage}
          </p>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
          My Plan
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your personalized fitness and nutrition plan
        </p>
      </div>

      {/* Current Package */}
      <Card className="border-2 border-primary">
        <CardBody className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                  Pro Membership
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                2 Personal Training sessions/month + Online Coaching + Meal Planning
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sessions This Month</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">8 / 8</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Next Billing</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">Dec 1</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Cost</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">$349</p>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Upgrade
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Goals */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                My Goals
              </h2>
            </div>
            <Button variant="ghost" size="sm">
              Manage Goals
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {goals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  🎉 All goals reviewed!
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Great job staying on top of your fitness journey!
                </p>
              </div>
            ) : (
              goals.map((goal) => {
              const deadlinePassed = isDeadlinePassed(goal.deadline);
              
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {goal.title}
                        </h3>
                        {deadlinePassed && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium rounded-full">
                            <AlertCircle className="w-3 h-3" />
                            Review
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>Current: {goal.current}</span>
                        <span>Target: {goal.target}</span>
                        <span className={`flex items-center gap-1 ${deadlinePassed ? 'text-red-500 dark:text-red-400 font-medium' : ''}`}>
                          <Calendar className="w-3 h-3" />
                          {goal.deadline}
                          {deadlinePassed && ' (Passed)'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-primary">
                        {goal.progress}%
                      </span>
                      {deadlinePassed && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleReviewGoal(goal)}
                        >
                          Review
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div
                      className={`rounded-full h-2 transition-all duration-500 ${
                        deadlinePassed ? 'bg-orange-500' : 'bg-primary'
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  {deadlinePassed && (
                    <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Deadline passed - Click "Review" to confirm if you achieved this goal
                    </p>
                  )}
                </div>
              );
            })
            )}
          </div>
        </CardBody>
      </Card>

      {/* Workout Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                Weekly Workout Plan
              </h2>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {workoutPlan.map((workout) => (
              <button
                key={workout.day}
                onClick={() => {
                  setSelectedWorkout(workout);
                  setIsWorkoutModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-primary hover:bg-primary/5 transition-all text-left group"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                    {workout.day}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {workout.focus}
                  </p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {workout.exercises.length} exercises
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {workout.duration}
                    </p>
                  </div>
                  <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Meal Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                Daily Meal Plan
              </h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Daily</p>
              <p className="text-lg font-bold text-primary">{totalCalories} cal</p>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {mealPlan.map((meal, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
              >
                <div className="flex-shrink-0 w-16 text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400">{meal.time}</p>
                  <p className="text-sm font-semibold text-primary">{meal.calories}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">cal</p>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {meal.meal}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {meal.description}
                  </p>
                </div>
                <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                </button>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Goal Review Modal */}
      {selectedGoal && (
        <GoalReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setSelectedGoal(null);
          }}
          goal={selectedGoal}
          onReview={handleGoalReview}
        />
      )}

      {/* Workout Details Modal */}
      {selectedWorkout && (
        <WorkoutDetailsModal
          isOpen={isWorkoutModalOpen}
          onClose={() => {
            setIsWorkoutModalOpen(false);
            setSelectedWorkout(null);
          }}
          workout={selectedWorkout}
        />
      )}
    </div>
  );
};

