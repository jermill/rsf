import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dumbbell,
  Users,
  Video,
  Calendar,
  Apple,
  Trophy,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Heart,
  Zap,
} from 'lucide-react';
import { Section } from '../components/ui/Section';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

interface Service {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  price: string;
  priceDetail: string;
  popular?: boolean;
  color: string;
}

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'training' | 'nutrition' | 'online'>('all');

  const services: Service[] = [
    {
      id: 'personal-training',
      icon: <Dumbbell className="w-8 h-8" />,
      title: 'Personal Training',
      description: 'One-on-one coaching tailored to your fitness goals with personalized workout plans.',
      features: [
        'Customized workout programs',
        'Form correction & technique',
        'Progress tracking & adjustments',
        'Nutritional guidance',
        'Flexible scheduling',
      ],
      price: '$80',
      priceDetail: 'per session',
      popular: true,
      color: 'from-primary/80 to-primary',
    },
    {
      id: 'flex-mobility-recovery',
      icon: <Zap className="w-8 h-8" />,
      title: 'Flex, Mobility & Recovery',
      description: 'Optimize your performance and prevent injury with specialized flexibility, recovery, and bodywork sessions.',
      features: [
        'Bodywork & massage therapy',
        '60-min & 90-min sessions available',
        'Personalized stretching routines',
        'Mobility assessments',
        'Recovery techniques',
      ],
      price: '$120',
      priceDetail: 'per session',
      popular: true,
      color: 'from-teal-400 to-primary',
    },
    {
      id: 'online-coaching',
      icon: <Video className="w-8 h-8" />,
      title: 'Online Coaching',
      description: 'Train from anywhere with virtual coaching sessions and custom workout plans delivered online.',
      features: [
        'Live video sessions',
        'Custom workout videos',
        'Weekly check-ins',
        'Mobile app access',
        'Chat support included',
      ],
      price: '$60',
      priceDetail: 'per month',
      color: 'from-emerald-500 to-primary',
    },
    {
      id: 'meal-planning',
      icon: <Apple className="w-8 h-8" />,
      title: 'Meal Planning',
      description: 'Personalized nutrition plans designed to fuel your workouts and achieve your body goals.',
      features: [
        'Custom meal plans',
        'Macro calculations',
        'Recipe library access',
        'Grocery shopping lists',
        'Dietary restrictions supported',
      ],
      price: '$50',
      priceDetail: 'per month',
      popular: true,
      color: 'from-cyan-500 to-primary',
    },
    {
      id: 'nutrition-consulting',
      icon: <Heart className="w-8 h-8" />,
      title: 'Nutrition Consulting',
      description: 'Expert guidance on building healthy eating habits and sustainable lifestyle changes.',
      features: [
        '1-on-1 consultations',
        'Habit-based coaching',
        'Supplement recommendations',
        'Body composition analysis',
        'Monthly follow-ups',
      ],
      price: '$100',
      priceDetail: 'per consultation',
      color: 'from-green-500 to-primary',
    },
    {
      id: 'transformation-program',
      icon: <Trophy className="w-8 h-8" />,
      title: '12-Week Transformation',
      description: 'Complete body transformation program combining training, nutrition, and accountability.',
      features: [
        '3x weekly training sessions',
        'Complete meal planning',
        'Weekly progress tracking',
        'Before & after photos',
        'Guaranteed results',
      ],
      price: '$1,200',
      priceDetail: '12 weeks',
      popular: true,
      color: 'from-primary to-emerald-400',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'training', label: 'Training' },
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'online', label: 'Online' },
  ];

  const filteredServices = services.filter(service => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'training') return ['personal-training', 'flex-mobility-recovery', 'transformation-program'].includes(service.id);
    if (selectedCategory === 'nutrition') return ['meal-planning', 'nutrition-consulting'].includes(service.id);
    if (selectedCategory === 'online') return service.id === 'online-coaching';
    return true;
  });

  const handleBookService = (serviceId: string) => {
    // Navigate to booking or contact form
    navigate('/onboarding', { state: { selectedService: serviceId } });
  };

  return (
    <div className="min-h-screen pt-28 pb-20">
      <Section className="bg-gradient-radial !py-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-12 px-4"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Our Services
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            From personal training to nutrition coaching, we offer comprehensive fitness solutions tailored to your goals.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-3 mb-12 flex-wrap px-4"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as any)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary text-black shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-7xl mx-auto">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="relative bg-gray-900 dark:bg-black rounded-xl border border-gray-800 overflow-hidden hover:border-primary/50 transition-all"
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10">
                  <Star className="w-3 h-3" />
                  Popular
                </div>
              )}

              {/* Icon Header - Simplified */}
              <div className={`bg-gradient-to-r ${service.color} p-4 flex justify-center items-center`}>
                <div className="text-white">
                  {service.icon}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  {service.description}
                </p>

                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-primary">
                      {service.price}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {service.priceDetail}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleBookService(service.id)}
                  className="w-full bg-primary text-black px-4 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 group"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 max-w-4xl mx-auto px-4"
        >
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 rounded-2xl p-8 sm:p-12 text-center text-white shadow-xl">
            <Zap className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Not Sure Which Service is Right for You?</h2>
            <p className="text-white/90 text-lg mb-6">
              Book a free consultation and we'll help you find the perfect program to reach your fitness goals.
            </p>
            <button
              onClick={() => navigate('/onboarding')}
              className="bg-primary text-black px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2 shadow-lg"
            >
              <Calendar className="w-5 h-5" />
              Schedule Free Consultation
            </button>
          </div>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 max-w-6xl mx-auto px-4"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Why Choose RSF Fitness?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Trophy className="w-8 h-8 text-yellow-500" />,
                title: 'Proven Results',
                description: 'Our clients achieve their goals with our evidence-based training methods.',
              },
              {
                icon: <Users className="w-8 h-8 text-blue-500" />,
                title: 'Expert Coaches',
                description: 'Certified trainers with years of experience in fitness and nutrition.',
              },
              {
                icon: <Heart className="w-8 h-8 text-red-500" />,
                title: 'Personalized Approach',
                description: 'Every program is customized to fit your unique goals and lifestyle.',
              },
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center"
              >
                <div className="flex justify-center mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
              </div>
            ))}
        </div>
        </motion.div>
      </Section>
    </div>
  );
};

export default ServicesPage;
