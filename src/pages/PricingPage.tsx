import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';
import { Section } from '../components/ui/Section';
import { subscriptionPlans } from '../data/subscriptions';
import { useNavigate } from 'react-router-dom';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/onboarding');
  };

  return (
    <>
      <Section className="pt-32 bg-gradient-radial">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.span 
              className="inline-block py-1 px-3 text-xs font-semibold bg-primary/20 text-primary rounded-full mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              PRICING PLANS
            </motion.span>
            <motion.h1 
              className="text-4xl md:text-5xl font-display font-bold text-light mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Community Package Pricing
            </motion.h1>
            <motion.p 
              className="text-xl text-light/70"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Monthly subscriptions bundling multiple services for maximum value. Save more compared to booking services individually.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {subscriptionPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <div 
                  className={`h-full flex flex-col bg-gray-900 dark:bg-black rounded-xl border overflow-hidden ${
                    plan.popular ? 'border-primary shadow-glow' : 'border-gray-800'
                  }`}
                >
                  {plan.popular && (
                    <div className="text-center bg-primary text-black py-2 font-bold text-sm">
                      MOST POPULAR
                    </div>
                  )}
                  
                  <div className="text-center p-6 pb-4">
                    <h3 className="font-display font-bold text-2xl mb-2 text-white">
                      {plan.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline justify-center mb-4">
                      <span className="font-display font-bold text-4xl text-primary">
                        ${plan.price}
                      </span>
                      <span className="text-gray-500 ml-1">/{plan.period}</span>
                    </div>
                  </div>
                  
                  <div className="flex-grow px-6 pb-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          {feature.included ? (
                            <Check className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                          ) : (
                            <X className="w-5 h-5 text-gray-600 mt-0.5 mr-3 flex-shrink-0" />
                          )}
                          <span className={feature.included ? 'text-gray-300 text-sm' : 'text-gray-600 text-sm'}>
                            {feature.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-6 pt-0">
                    <button
                      onClick={handleGetStarted}
                      className="w-full bg-primary text-black px-4 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 group"
                    >
                      Get Started
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>
      </Section>

      <Section className="bg-gradient-radial">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-display font-bold text-light mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-left bg-dark-surface/50 backdrop-blur-sm rounded-2xl p-6"
              >
                <h3 className="text-xl font-semibold text-light mb-3">{faq.question}</h3>
                <p className="text-light/70">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
};

const faqs = [
  {
    question: "What happens if I don't use all my monthly sessions?",
    answer: "Unused sessions do not roll over to the next month. However, you can reschedule sessions within the same month based on trainer availability. We recommend booking your sessions in advance."
  },
  {
    question: "Can I upgrade or downgrade my package?",
    answer: "Yes! You can upgrade or downgrade between tiers at any time. Changes take effect at the start of your next billing cycle, and we'll prorate any differences."
  },
  {
    question: "How much do I save with a package vs. individual services?",
    answer: "Our packages offer significant savings. For example, the Elite package includes $670+ worth of services monthly for $599. The more you commit, the more you save!"
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes, you can cancel your subscription at any time. We offer month-to-month billing with no long-term contracts or cancellation fees."
  },
  {
    question: "Can I add extra services to my package?",
    answer: "Absolutely! You can book additional sessions of any service at their regular rates. Package members receive priority booking for add-on services."
  },
  {
    question: "Do packages include online and in-person options?",
    answer: "Yes! Pro and Elite tiers include both online coaching and in-person training sessions, giving you flexibility to train how and where you prefer."
  }
];

export default PricingPage;