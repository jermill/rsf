import { SubscriptionPlan } from '../types';

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 179,
    period: 'month',
    description: 'Perfect for beginners starting their fitness journey',
    color: '#6AFFB7',
    features: [
      { included: true, title: '1 Personal Training session/month' },
      { included: true, title: 'Access to community forums' },
      { included: true, title: 'Basic workout tracking' },
      { included: true, title: 'Public profile' },
      { included: true, title: 'Join community challenges' },
      { included: true, title: 'Weekly group sessions' },
      { included: false, title: 'Private messaging' },
      { included: false, title: 'Create custom groups' },
      { included: false, title: 'Online coaching' },
      { included: false, title: 'Custom meal plans' }
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 349,
    period: 'month',
    description: 'For fitness enthusiasts serious about their goals',
    popular: true,
    color: '#6AFFB7',
    features: [
      { included: true, title: '2 Personal Training sessions/month' },
      { included: true, title: 'Online Coaching included ($60 value)' },
      { included: true, title: 'Meal Planning included ($50 value)' },
      { included: true, title: 'All Basic features' },
      { included: true, title: 'Private messaging' },
      { included: true, title: 'Create custom groups' },
      { included: true, title: 'Priority support' },
      { included: true, title: 'Exclusive content access' },
      { included: true, title: 'Personalized workout plans' },
      { included: false, title: 'Advanced analytics' }
    ]
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 599,
    period: 'month',
    description: 'Premium experience with personalized coaching',
    color: '#6AFFB7',
    features: [
      { included: true, title: '4 Personal Training sessions/month ($320 value)' },
      { included: true, title: 'Online Coaching included ($60 value)' },
      { included: true, title: 'Meal Planning included ($50 value)' },
      { included: true, title: '2 Flex, Mobility & Recovery sessions/month ($240 value)' },
      { included: true, title: 'All Pro features' },
      { included: true, title: 'Advanced analytics' },
      { included: true, title: 'VIP community events' },
      { included: true, title: '24/7 support access' },
      { included: true, title: 'Exclusive Elite workshops' },
      { included: true, title: 'Quarterly fitness assessments' },
      { included: true, title: 'Priority booking for all classes' }
    ]
  }
];