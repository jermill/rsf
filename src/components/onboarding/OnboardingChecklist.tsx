import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  ExternalLink,
  ChevronRight,
  Clock,
  Star
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ChecklistItem } from '../../hooks/useOnboarding';
import { cn } from '../../utils/cn';

interface OnboardingChecklistProps {
  items: ChecklistItem[];
  onItemClick: (item: ChecklistItem) => void;
  onComplete?: (itemKey: string) => void;
}

export const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({
  items,
  onItemClick,
  onComplete,
}) => {
  const completedCount = items.filter(item => item.is_completed).length;
  const totalCount = items.length;
  const requiredItems = items.filter(item => item.is_required);
  const optionalItems = items.filter(item => !item.is_required);
  const requiredCompleted = requiredItems.filter(item => item.is_completed).length;

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Getting Started Checklist
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span className="font-semibold text-gray-900 dark:text-white">
              {completedCount} / {totalCount}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / totalCount) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80 rounded-full"
          />
        </div>

        {requiredCompleted < requiredItems.length && (
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            <Star className="w-4 h-4 inline text-yellow-500 mr-1" />
            {requiredItems.length - requiredCompleted} required item{requiredItems.length - requiredCompleted !== 1 ? 's' : ''} remaining
          </p>
        )}
      </div>

      <div className="p-6 space-y-4">
        {/* Required Items */}
        {requiredItems.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Required Steps
            </h4>
            <div className="space-y-2">
              {requiredItems.map((item, index) => (
                <ChecklistItemCard
                  key={item.id}
                  item={item}
                  index={index}
                  onClick={() => onItemClick(item)}
                  onComplete={onComplete}
                />
              ))}
            </div>
          </div>
        )}

        {/* Optional Items */}
        {optionalItems.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Optional (Recommended)
            </h4>
            <div className="space-y-2">
              {optionalItems.map((item, index) => (
                <ChecklistItemCard
                  key={item.id}
                  item={item}
                  index={index + requiredItems.length}
                  onClick={() => onItemClick(item)}
                  onComplete={onComplete}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

interface ChecklistItemCardProps {
  item: ChecklistItem;
  index: number;
  onClick: () => void;
  onComplete?: (itemKey: string) => void;
}

const ChecklistItemCard: React.FC<ChecklistItemCardProps> = ({
  item,
  index,
  onClick,
  onComplete,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        'group relative p-4 rounded-lg border transition-all cursor-pointer',
        item.is_completed
          ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md'
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <div className="flex-shrink-0 mt-0.5">
          {item.is_completed ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <Circle className="w-6 h-6 text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h5 className={cn(
              'font-semibold transition-colors',
              item.is_completed
                ? 'text-green-700 dark:text-green-300 line-through'
                : 'text-gray-900 dark:text-white group-hover:text-primary'
            )}>
              {item.item_title}
            </h5>
            {item.is_required && !item.is_completed && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                Required
              </span>
            )}
          </div>

          {item.item_description && (
            <p className={cn(
              'mt-1 text-sm',
              item.is_completed
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-600 dark:text-gray-400'
            )}>
              {item.item_description}
            </p>
          )}

          {item.completed_at && (
            <p className="mt-2 text-xs text-green-600 dark:text-green-400">
              ✓ Completed {new Date(item.completed_at).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Action Icon */}
        <div className="flex-shrink-0">
          {item.action_type === 'external' ? (
            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
          )}
        </div>
      </div>
    </motion.div>
  );
};

