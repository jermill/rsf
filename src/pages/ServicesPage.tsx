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
    <div className="min-h-screen pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-20">
      <Section className="bg-gradient-radial !py-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-8 sm:mb-10 md:mb-12 px-4 sm:px-6"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Our Services
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            From personal training to nutrition coaching, we offer comprehensive fitness solutions tailored to your goals.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 md:mb-12 flex-wrap px-4 sm:px-6"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as any)}
              className={`px-4 sm:px-5 md:px-6 py-2.5 sm:py-2 rounded-full text-sm sm:text-base font-medium transition-all touch-manipulation ${
                selectedCategory === category.id
                  ? 'bg-primary text-black shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95'
              }`}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 px-4 sm:px-6 max-w-7xl mx-auto">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="relative bg-gray-900 dark:bg-black rounded-xl border border-gray-800 overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all"
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-yellow-500 text-black px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10 shadow-lg">
                  <Star className="w-3 h-3" />
                  <span className="hidden sm:inline">Popular</span>
                  <span className="sm:hidden">★</span>
                </div>
              )}

              {/* Icon Header - Simplified */}
              <div className={`bg-gradient-to-r ${service.color} p-3 sm:p-4 flex justify-center items-center`}>
                <div className="text-white">
                  {service.icon}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 md:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 sm:mb-5 md:mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Pricing */}
                <div className="mb-4 sm:mb-5 md:mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-bold text-primary">
                      {service.price}
                    </span>
                    <span className="text-gray-500 text-xs sm:text-sm">
                      {service.priceDetail}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-7 md:mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleBookService(service.id)}
                  className="w-full bg-primary text-black px-4 py-3 sm:py-3.5 rounded-lg font-semibold hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2 group touch-manipulation"
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
          className="mt-12 sm:mt-14 md:mt-16 max-w-4xl mx-auto px-4 sm:px-6"
        >
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center text-white shadow-xl">
            <Zap className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Not Sure Which Service is Right for You?</h2>
            <p className="text-white/90 text-base sm:text-lg mb-5 sm:mb-6">
              Book a free consultation and we'll help you find the perfect program to reach your fitness goals.
            </p>
            <button
              onClick={() => navigate('/onboarding')}
              className="bg-primary text-black px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg font-semibold hover:bg-primary/90 active:scale-95 transition-all inline-flex items-center justify-center gap-2 shadow-lg touch-manipulation w-full sm:w-auto"
            >
              <Calendar className="w-5 h-5" />
              <span className="text-sm sm:text-base">Schedule Free Consultation</span>
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
