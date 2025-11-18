import React, { useState } from 'react';
import { CreditCard, Download, Calendar, Crown, AlertCircle } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { ChangePlanModal } from '../../ui/ChangePlanModal';
import { subscriptionPlans } from '../../../data/subscriptions';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  invoice?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2025-11-01',
    description: 'Pro Membership - November',
    amount: 349,
    status: 'paid',
    invoice: 'INV-2025-11-001',
  },
  {
    id: '2',
    date: '2025-10-01',
    description: 'Pro Membership - October',
    amount: 349,
    status: 'paid',
    invoice: 'INV-2025-10-001',
  },
  {
    id: '3',
    date: '2025-09-15',
    description: 'Additional Personal Training Session',
    amount: 80,
    status: 'paid',
    invoice: 'INV-2025-09-015',
  },
  {
    id: '4',
    date: '2025-09-01',
    description: 'Pro Membership - September',
    amount: 349,
    status: 'paid',
    invoice: 'INV-2025-09-001',
  },
];

export const BillingSection: React.FC = () => {
  const [currentPlanId, setCurrentPlanId] = useState('pro'); // TODO: Fetch from user profile
  const [isChangePlanModalOpen, setIsChangePlanModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const currentPlan = subscriptionPlans.find(p => p.id === currentPlanId);

  const handleChangePlan = (newPlanId: string) => {
    console.log('🔄 Changing plan from', currentPlanId, 'to', newPlanId);
    
    // TODO: Call Supabase to update user's subscription
    // await supabase.from('profiles').update({ subscription_plan: newPlanId }).eq('id', user.id)
    
    setCurrentPlanId(newPlanId);
    
    const newPlan = subscriptionPlans.find(p => p.id === newPlanId);
    setSuccessMessage(`✅ Successfully switched to ${newPlan?.name} plan!`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const getStatusBadge = (status: Transaction['status']) => {
    const badges = {
      paid: 'bg-green-500/10 text-green-600 dark:text-green-400',
      pending: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
      failed: 'bg-red-500/10 text-red-600 dark:text-red-400',
    };
    return badges[status];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const totalSpent = mockTransactions
    .filter((t) => t.status === 'paid')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
            Billing & Payments
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your subscription and payment history
          </p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-sm text-green-800 dark:text-green-300 text-center font-medium">
            {successMessage}
          </p>
        </div>
      )}

      {/* Current Subscription */}
      <Card className="border-2 border-primary">
        <CardBody className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Crown className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-1">
                  {currentPlan?.name} Membership
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Active subscription
                </p>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Cost</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">${currentPlan?.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Next Billing</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">Dec 1, 2025</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">Aug 2025</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsChangePlanModalOpen(true)}
              >
                Change Plan
              </Button>
              <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                Cancel Subscription
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                Payment Method
              </h2>
            </div>
            <Button variant="ghost" size="sm">
              Update
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  •••• •••• •••• 4242
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Expires 12/2026
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium rounded-full">
              Default
            </span>
          </div>
        </CardBody>
      </Card>

      {/* Payment Reminder */}
      <Card className="bg-yellow-500/5 border border-yellow-500/20">
        <CardBody className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Upcoming Payment
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your next payment of <span className="font-semibold text-gray-900 dark:text-white">${currentPlan?.price}</span> will be processed on{' '}
                <span className="font-semibold text-gray-900 dark:text-white">December 1, 2025</span>.
                Make sure your payment method is up to date.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Billing Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Spent</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${totalSpent.toLocaleString()}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">This Month</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">${currentPlan?.price}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sessions Used</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">8 / 8</p>
          </CardBody>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                Transaction History
              </h2>
            </div>
            <Button variant="ghost" size="sm" leftIcon={<Download className="w-4 h-4" />}>
              Export
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {mockTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {transaction.description}
                    </h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span>{formatDate(transaction.date)}</span>
                    {transaction.invoice && (
                      <>
                        <span>•</span>
                        <span>{transaction.invoice}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    ${transaction.amount}
                  </p>
                  {transaction.invoice && (
                    <Button variant="ghost" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                      Invoice
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Change Plan Modal */}
      <ChangePlanModal
        isOpen={isChangePlanModalOpen}
        onClose={() => setIsChangePlanModalOpen(false)}
        currentPlanId={currentPlanId}
        onChangePlan={handleChangePlan}
      />
    </div>
  );
};

