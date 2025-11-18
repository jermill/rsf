import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles,
  Dumbbell, 
  Apple, 
  Users, 
  Calendar,
  X,
  Check,
  ArrowRight
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Recommendation } from '../../hooks/useOnboarding';
import { cn } from '../../utils/cn';

interface PersonalizedRecommendationsProps {
  recommendations: Recommendation[];
  onAccept: (id: string) => void;
  onDismiss: (id: string) => void;
}

export const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  recommendations,
  onAccept,
  onDismiss,
}) => {
  if (recommendations.length === 0) {
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'workout_plan':
        return <Dumbbell className="w-6 h-6" />;
      case 'meal_plan':
        return <Apple className="w-6 h-6" />;
      case 'trainer':
        return <Users className="w-6 h-6" />;
      case 'class':
        return <Calendar className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'workout_plan':
        return 'from-blue-500 to-blue-600';
      case 'meal_plan':
        return 'from-green-500 to-green-600';
      case 'trainer':
        return 'from-purple-500 to-purple-600';
      case 'class':
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-primary to-primary/80';
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Personalized for You
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Based on your goals and preferences
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary transition-all">
              {/* Gradient Background */}
              <div className={cn(
                'absolute inset-0 bg-gradient-to-r opacity-5',
                getColor(rec.recommendation_type)
              )} />

              <div className="relative p-5">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={cn(
                    'flex-shrink-0 p-3 rounded-lg bg-gradient-to-br text-white',
                    getColor(rec.recommendation_type)
                  )}>
                    {getIcon(rec.recommendation_type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                        {rec.title}
                      </h4>
                      {rec.priority >= 9 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                          High Priority
                        </span>
                      )}
                    </div>

                    {rec.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {rec.description}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => onAccept(rec.id)}
                        leftIcon={<Check className="w-4 h-4" />}
                      >
                        I'm Interested
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDismiss(rec.id)}
                        leftIcon={<X className="w-4 h-4" />}
                      >
                        Not Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <ArrowRight className="w-4 h-4" />
          More recommendations will appear as you complete your profile
        </p>
      </div>
    </Card>
  );
};

