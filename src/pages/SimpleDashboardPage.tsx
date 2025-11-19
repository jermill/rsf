import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Calendar, 
  MessageCircle, 
  TrendingUp, 
  CreditCard, 
  Settings,
  Award,
  Dumbbell,
  Crown,
  User,
  ArrowRight
} from 'lucide-react';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Section } from '../components/ui/Section';

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  color: string;
  badge?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  title,
  description,
  buttonText,
  onClick,
  color,
  badge,
}) => (
  <Card className="hover:shadow-xl transition-all duration-300 sm:hover:scale-105 relative overflow-hidden group touch-manipulation">
    {badge && (
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
        <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-primary text-dark text-xs font-bold rounded-full">
          {badge}
        </span>
      </div>
    )}
    <CardBody className="p-5 sm:p-6 md:p-8 text-center">
      <div className={`mx-auto w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 ${color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-display font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-5 md:mb-6 min-h-[40px] sm:min-h-[48px] leading-relaxed">
        {description}
      </p>
      <Button
        variant="outline"
        fullWidth
        rightIcon={<ArrowRight className="w-4 h-4" />}
        onClick={onClick}
        className="touch-manipulation active:scale-95"
      >
        {buttonText}
      </Button>
    </CardBody>
  </Card>
);

const SimpleDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [upcomingSessions, setUpcomingSessions] = useState(3);
  const [currentStreak, setCurrentStreak] = useState(5);

  useEffect(() => {
    console.log('SimpleDashboard mounted, user:', user?.id || 'none');
    
    // Safety timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log('Loading timeout reached, forcing stop');
      setLoading(false);
    }, 5000);

    if (user) {
      fetchProfile().finally(() => {
        clearTimeout(timeout);
      });
    } else {
      // If no user, stop loading and redirect to home
      console.log('No user found, stopping loading');
      setLoading(false);
      clearTimeout(timeout);
    }

    return () => clearTimeout(timeout);
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
        return;
      }

      if (!data) {
        console.log('No profile found, redirecting to onboarding');
        navigate('/onboarding', { replace: true });
        return;
      }

      // Set profile data even if onboarding not completed
      setProfile(data);
      setLoading(false);

      // Check onboarding after setting profile
      if (!data.onboarding_completed_at) {
        console.log('Onboarding not completed, redirecting...');
        setTimeout(() => {
          navigate('/onboarding', { replace: true });
        }, 100);
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const canMessageCoach = () => {
    // Check if user has Pro or Elite membership
    const plan = profile?.subscription_package?.toLowerCase();
    return plan === 'pro' || plan === 'elite';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-black">
        <p className="text-gray-600 dark:text-gray-400 mb-4">Please sign in to view your dashboard</p>
        <Button variant="primary" onClick={() => navigate('/')}>
          Go to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-20">
      <Section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-7 md:space-y-8">
          {/* Welcome Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-3 sm:border-4 border-primary"
                />
              ) : (
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                </div>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 leading-tight">
              Welcome back, {profile?.first_name || 'there'}! 👋
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Ready to crush your fitness goals today?
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-7 md:mb-8">
            <Card>
              <CardBody className="p-4 sm:p-5 md:p-6 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">{upcomingSessions}</div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Upcoming Sessions</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-4 sm:p-5 md:p-6 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-500 mb-1">{currentStreak}</div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Day Streak 🔥</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-4 sm:p-5 md:p-6 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-500 mb-1">8/8</div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Sessions Used</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-4 sm:p-5 md:p-6 text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-500 mb-1">
                  {profile?.subscription_package || 'Basic'}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Current Plan</p>
              </CardBody>
            </Card>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            <ActionCard
              icon={<Calendar className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />}
              title="Book a Session"
              description="Schedule your next training session with your coach"
              buttonText="Book Now"
              onClick={() => navigate('/dashboard/schedule')}
              color="bg-primary/10"
            />

            <ActionCard
              icon={<Crown className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-yellow-500" />}
              title="My Plan"
              description="View your membership, goals, and training plan"
              buttonText="View Plan"
              onClick={() => navigate('/dashboard/plan')}
              color="bg-yellow-500/10"
            />

            <ActionCard
              icon={<TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-500" />}
              title="Track Progress"
              description="Log your measurements and view your progress"
              buttonText="Track Now"
              onClick={() => navigate('/dashboard/progress')}
              color="bg-blue-500/10"
            />

            <ActionCard
              icon={<MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-500" />}
              title="Message Coach"
              description={
                canMessageCoach()
                  ? "Get personalized advice from your coach"
                  : "Upgrade to Pro or Elite to message your coach"
              }
              buttonText={canMessageCoach() ? "Send Message" : "Upgrade Plan"}
              onClick={() => {
                if (canMessageCoach()) {
                  navigate('/dashboard/messages');
                } else {
                  navigate('/pricing');
                }
              }}
              color="bg-green-500/10"
              badge={!canMessageCoach() ? "Pro Feature" : undefined}
            />

            <ActionCard
              icon={<Dumbbell className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-500" />}
              title="My Sessions"
              description="View your upcoming and past training sessions"
              buttonText="View Sessions"
              onClick={() => navigate('/dashboard/sessions')}
              color="bg-purple-500/10"
            />

            <ActionCard
              icon={<CreditCard className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-pink-500" />}
              title="Billing & Payments"
              description="Manage your subscription and payment methods"
              buttonText="Manage Billing"
              onClick={() => navigate('/dashboard/billing')}
              color="bg-pink-500/10"
            />
          </div>

          {/* Settings Button */}
          <div className="flex justify-center mt-8 sm:mt-10 md:mt-12">
            <Button
              variant="ghost"
              size="lg"
              leftIcon={<Settings className="w-5 h-5" />}
              onClick={() => navigate('/dashboard/settings')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white touch-manipulation active:scale-95 w-full sm:w-auto"
            >
              Account Settings
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default SimpleDashboardPage;

