import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '../ui/Button';
import { CreditCard, Loader2 } from 'lucide-react';
import { handleError } from '../../utils/errorHandler';
import { showNotification } from '../../utils/notifications';

interface CheckoutFormProps {
  amount: number;
  planName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  amount,
  planName,
  onSuccess,
  onCancel,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (error) {
        handleError(error, {
          customMessage: error.message || 'Payment failed. Please try again.',
        });
      } else {
        showNotification('Payment successful!', 'success');
        onSuccess?.();
      }
    } catch (error) {
      handleError(error, {
        customMessage: 'An unexpected error occurred during payment.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Plan Details */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {planName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Monthly Subscription
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              ${amount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              per month
            </div>
          </div>
        </div>
      </div>

      {/* Payment Element */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <PaymentElement />
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          type="submit"
          variant="primary"
          disabled={!stripe || loading}
          leftIcon={loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
          className="flex-1"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </div>

      {/* Security Notice */}
      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
        🔒 Secured by Stripe. Your payment information is encrypted and secure.
      </p>
    </form>
  );
};

