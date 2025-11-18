import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { SubscriptionPlan } from '../../types';
import { cn } from '../../utils/cn';

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  currentPlan?: string;
  onSelectPlan: (planId: string) => void;
  loading?: boolean;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  plan,
  currentPlan,
  onSelectPlan,
  loading = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isCurrentPlan = currentPlan === plan.id;
  const isPopular = plan.popular;

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        isPopular && 'border-2 border-primary shadow-xl',
        isHovered && 'transform scale-105',
        isCurrentPlan && 'bg-primary/5'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-xs font-bold uppercase rounded-bl-lg">
          Most Popular
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute top-0 left-0 bg-green-500 text-white px-4 py-1 text-xs font-bold uppercase rounded-br-lg">
          Current Plan
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {plan.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {plan.description}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold text-primary">
            ${plan.price}
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            /{plan.period}
          </span>
        </div>

        {/* Features */}
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li
              key={index}
              className={cn(
                'flex items-start gap-3 text-sm',
                feature.included
                  ? 'text-gray-700 dark:text-gray-300'
                  : 'text-gray-400 dark:text-gray-600 line-through'
              )}
            >
              <Check
                className={cn(
                  'w-5 h-5 flex-shrink-0 mt-0.5',
                  feature.included
                    ? 'text-green-500'
                    : 'text-gray-400 dark:text-gray-600'
                )}
              />
              <span>{feature.title}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button
          variant={isPopular ? 'primary' : 'outline'}
          className="w-full"
          onClick={() => onSelectPlan(plan.id)}
          disabled={loading || isCurrentPlan}
          leftIcon={loading ? <Loader2 className="w-5 h-5 animate-spin" /> : undefined}
        >
          {isCurrentPlan
            ? 'Current Plan'
            : loading
            ? 'Processing...'
            : `Choose ${plan.name}`}
        </Button>
      </div>
    </Card>
  );
};

