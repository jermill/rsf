import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  Award, 
  Activity,
  Clock,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, trend, color }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardBody className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {value}
          </h3>
          {trend && (
            <p className="text-xs text-primary font-medium">{trend}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </CardBody>
  </Card>
);

interface UpcomingSession {
  id: string;
  date: string;
  time: string;
  type: string;
  trainer: string;
  status: string;
}

export const OverviewSection: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedThisMonth: 0,
    upcomingBookings: 0,
    currentStreak: 0,
  });
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      setProfile(profileData);

      // TODO: Fetch real session data when sessions table is ready
      // For now, using mock data
      setStats({
        totalSessions: 24,
        completedThisMonth: 8,
        upcomingBookings: 3,
        currentStreak: 5,
      });

      setUpcomingSessions([
        {
          id: '1',
          date: 'Nov 20, 2025',
          time: '10:00 AM',
          type: 'Personal Training',
          trainer: 'Coach Mike',
          status: 'confirmed',
        },
        {
          id: '2',
          date: 'Nov 22, 2025',
          time: '2:00 PM',
          type: 'Flex & Mobility',
          trainer: 'Coach Sarah',
          status: 'confirmed',
        },
        {
          id: '3',
          date: 'Nov 25, 2025',
          time: '9:00 AM',
          type: 'Online Coaching',
          trainer: 'Coach Alex',
          status: 'pending',
        },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {profile?.first_name || 'there'}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's your fitness journey overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Activity className="w-6 h-6 text-primary" />}
          label="Total Sessions"
          value={stats.totalSessions}
          trend="+12% from last month"
          color="bg-primary/10"
        />
        <StatCard
          icon={<CheckCircle2 className="w-6 h-6 text-green-500" />}
          label="This Month"
          value={stats.completedThisMonth}
          trend="On track!"
          color="bg-green-500/10"
        />
        <StatCard
          icon={<Calendar className="w-6 h-6 text-blue-500" />}
          label="Upcoming"
          value={stats.upcomingBookings}
          color="bg-blue-500/10"
        />
        <StatCard
          icon={<Award className="w-6 h-6 text-yellow-500" />}
          label="Day Streak"
          value={stats.currentStreak}
          trend="Keep it going!"
          color="bg-yellow-500/10"
        />
      </div>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                Upcoming Sessions
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate('/dashboard/sessions')}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {upcomingSessions.length > 0 ? (
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-primary/50 dark:hover:border-primary/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {session.type}
                      </h3>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          session.status === 'confirmed'
                            ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                            : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                        }`}
                      >
                        {session.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {session.trainer}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {session.date}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {session.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No upcoming sessions scheduled
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/dashboard/schedule')}
              >
                Book a Session
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Book Session
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Schedule your next workout
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Track Progress
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Log your measurements
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                <Award className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  View Goals
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Check your milestones
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

