import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Crown, TrendingUp, TrendingDown, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { subscriptionPlans } from '../../data/subscriptions';

interface ChangePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlanId: string;
  onChangePlan: (newPlanId: string) => void;
}

export const ChangePlanModal: React.FC<ChangePlanModalProps> = ({
  isOpen,
  onClose,
  currentPlanId,
  onChangePlan,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const currentPlan = subscriptionPlans.find(p => p.id === currentPlanId);
  const selectedPlan = subscriptionPlans.find(p => p.id === selectedPlanId);

  const handleSelectPlan = (planId: string) => {
    if (planId === currentPlanId) return;
    setSelectedPlanId(planId);
    setShowConfirmation(true);
  };

  const handleConfirmChange = () => {
    if (selectedPlanId) {
      onChangePlan(selectedPlanId);
      setShowConfirmation(false);
      setSelectedPlanId(null);
      onClose();
    }
  };

  const handleBack = () => {
    setShowConfirmation(false);
    setSelectedPlanId(null);
  };

  const isUpgrade = selectedPlan && currentPlan && selectedPlan.price > currentPlan.price;
  const isDowngrade = selectedPlan && currentPlan && selectedPlan.price < currentPlan.price;

  if (!isOpen) return null;

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
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="relative w-full max-w-6xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>

                {!showConfirmation ? (
                  /* Plan Selection View */
                  <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
                        Change Your Plan
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Upgrade or downgrade your subscription anytime
                      </p>
                    </div>

                    {/* Current Plan Badge */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Current Plan:
                      </span>
                      <span className="px-4 py-1.5 bg-primary/10 text-primary font-semibold rounded-full text-sm">
                        {currentPlan?.name}
                      </span>
                    </div>

                    {/* Plans Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {subscriptionPlans.map((plan) => {
                        const isCurrent = plan.id === currentPlanId;
                        const canSelect = !isCurrent;

                        return (
                          <motion.div
                            key={plan.id}
                            whileHover={canSelect ? { scale: 1.02, y: -5 } : {}}
                            className={`relative rounded-2xl border-2 p-6 transition-all ${
                              isCurrent
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 cursor-pointer'
                            }`}
                            onClick={() => canSelect && handleSelectPlan(plan.id)}
                          >
                            {/* Popular Badge */}
                            {plan.popular && (
                              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-gradient-to-r from-primary to-primary-dark text-black font-bold text-xs rounded-full shadow-lg">
                                  <Sparkles className="w-3 h-3" />
                                  MOST POPULAR
                                </span>
                              </div>
                            )}

                            {/* Current Badge */}
                            {isCurrent && (
                              <div className="absolute top-4 right-4">
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-black font-semibold text-xs rounded-full">
                                  <Check className="w-3 h-3" />
                                  Current
                                </span>
                              </div>
                            )}

                            {/* Plan Icon */}
                            <div className="flex items-center justify-center mb-4">
                              <div className="p-3 bg-primary/10 rounded-xl">
                                <Crown className="w-8 h-8 text-primary" />
                              </div>
                            </div>

                            {/* Plan Name */}
                            <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white text-center mb-2">
                              {plan.name}
                            </h3>

                            {/* Price */}
                            <div className="text-center mb-4">
                              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                ${plan.price}
                              </span>
                              <span className="text-gray-600 dark:text-gray-400">/{plan.period}</span>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
                              {plan.description}
                            </p>

                            {/* Features */}
                            <ul className="space-y-2 mb-6">
                              {plan.features.slice(0, 5).map((feature, idx) => (
                                <li
                                  key={idx}
                                  className={`flex items-start gap-2 text-sm ${
                                    feature.included
                                      ? 'text-gray-900 dark:text-white'
                                      : 'text-gray-400 dark:text-gray-600'
                                  }`}
                                >
                                  <Check
                                    className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                                      feature.included ? 'text-primary' : 'text-gray-300 dark:text-gray-700'
                                    }`}
                                  />
                                  <span className={!feature.included ? 'line-through' : ''}>
                                    {feature.title}
                                  </span>
                                </li>
                              ))}
                              {plan.features.length > 5 && (
                                <li className="text-sm text-gray-500 dark:text-gray-400 italic">
                                  + {plan.features.length - 5} more features
                                </li>
                              )}
                            </ul>

                            {/* Action Button */}
                            {isCurrent ? (
                              <Button
                                variant="outline"
                                className="w-full cursor-default"
                                disabled
                              >
                                Your Current Plan
                              </Button>
                            ) : (
                              <Button
                                variant="primary"
                                className="w-full"
                                onClick={() => handleSelectPlan(plan.id)}
                              >
                                Select {plan.name}
                              </Button>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Info Note */}
                    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-300 text-center">
                        💡 You can change your plan anytime. Changes take effect on your next billing cycle.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Confirmation View */
                  <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        {isUpgrade ? (
                          <TrendingUp className="w-8 h-8 text-primary" />
                        ) : (
                          <TrendingDown className="w-8 h-8 text-primary" />
                        )}
                      </div>
                      <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
                        Confirm Plan {isUpgrade ? 'Upgrade' : 'Change'}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Review the details of your plan change
                      </p>
                    </div>

                    {/* Plan Comparison */}
                    <div className="max-w-2xl mx-auto mb-8">
                      <div className="grid grid-cols-3 gap-4 items-center">
                        {/* Current Plan */}
                        <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Plan</p>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            {currentPlan?.name}
                          </h3>
                          <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                            ${currentPlan?.price}
                          </p>
                        </div>

                        {/* Arrow */}
                        <div className="flex justify-center">
                          <ArrowRight className="w-8 h-8 text-primary" />
                        </div>

                        {/* New Plan */}
                        <div className="text-center p-6 bg-primary/10 rounded-xl border-2 border-primary">
                          <p className="text-sm text-primary font-semibold mb-2">New Plan</p>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            {selectedPlan?.name}
                          </h3>
                          <p className="text-2xl font-bold text-primary">
                            ${selectedPlan?.price}
                          </p>
                        </div>
                      </div>

                      {/* Price Difference */}
                      {currentPlan && selectedPlan && (
                        <div className="mt-6 text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Monthly Cost Change
                          </p>
                          <p className={`text-3xl font-bold ${
                            isUpgrade ? 'text-primary' : 'text-green-600 dark:text-green-400'
                          }`}>
                            {isUpgrade ? '+' : '-'}${Math.abs(selectedPlan.price - currentPlan.price)}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Billing Details */}
                    <div className="max-w-2xl mx-auto mb-8">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 space-y-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                          Billing Details
                        </h3>
                        
                        {isUpgrade ? (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Effective Date</span>
                              <span className="font-semibold text-gray-900 dark:text-white">Immediately</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Prorated Charge Today</span>
                              <span className="font-semibold text-gray-900 dark:text-white">
                                ${Math.abs(selectedPlan!.price - currentPlan!.price)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Next Full Billing</span>
                              <span className="font-semibold text-gray-900 dark:text-white">
                                ${selectedPlan?.price} on Dec 1, 2025
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Effective Date</span>
                              <span className="font-semibold text-gray-900 dark:text-white">Dec 1, 2025</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Current Plan Continues Until</span>
                              <span className="font-semibold text-gray-900 dark:text-white">Nov 30, 2025</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">New Billing Amount</span>
                              <span className="font-semibold text-gray-900 dark:text-white">
                                ${selectedPlan?.price}/month
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Warning for Downgrade */}
                      {isDowngrade && (
                        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                          <p className="text-sm text-yellow-800 dark:text-yellow-300">
                            ⚠️ <strong>Note:</strong> Some features will be unavailable after downgrading. You'll retain access to {currentPlan?.name} features until Dec 1, 2025.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 max-w-md mx-auto">
                      <Button
                        variant="outline"
                        onClick={handleBack}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleConfirmChange}
                        className="flex-1"
                      >
                        Confirm {isUpgrade ? 'Upgrade' : 'Change'}
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

