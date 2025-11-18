import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock,
  TrendingUp,
  AlertCircle,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { handleError } from '../../utils/errorHandler';

interface OnboardingStats {
  total_users: number;
  in_progress: number;
  completed: number;
  completion_rate: number;
  avg_time_to_complete_hours: number;
  stuck_users: number;
}

interface UserProgress {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  current_step: number;
  total_steps: number;
  is_complete: boolean;
  last_activity_at: string;
  created_at: string;
  time_spent_minutes: number;
}

const OnboardingDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<OnboardingStats | null>(null);
  const [users, setUsers] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'stuck' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOnboardingData();
  }, []);

  const fetchOnboardingData = async () => {
    try {
      setLoading(true);

      // Fetch stats
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_onboarding_stats');

      if (statsError) throw statsError;
      if (statsData && statsData.length > 0) {
        setStats(statsData[0]);
      }

      // Fetch user progress
      const { data: usersData, error: usersError } = await supabase
        .from('onboarding_progress')
        .select(`
          user_id,
          current_step,
          total_steps,
          is_complete,
          last_activity_at,
          created_at,
          time_spent_minutes,
          profiles!inner(email, first_name, last_name)
        `)
        .order('last_activity_at', { ascending: false });

      if (usersError) throw usersError;

      const formattedUsers = usersData?.map((item: any) => ({
        user_id: item.user_id,
        email: item.profiles.email,
        first_name: item.profiles.first_name || '',
        last_name: item.profiles.last_name || '',
        current_step: item.current_step,
        total_steps: item.total_steps,
        is_complete: item.is_complete,
        last_activity_at: item.last_activity_at,
        created_at: item.created_at,
        time_spent_minutes: item.time_spent_minutes,
      })) || [];

      setUsers(formattedUsers);
    } catch (error) {
      handleError(error, {
        customMessage: 'Failed to load onboarding data',
      });
    } finally {
      setLoading(false);
    }
  };

  const getFilteredUsers = () => {
    let filtered = users;

    // Apply status filter
    if (filter === 'in_progress') {
      filtered = filtered.filter(u => !u.is_complete);
    } else if (filter === 'completed') {
      filtered = filtered.filter(u => u.is_complete);
    } else if (filter === 'stuck') {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      filtered = filtered.filter(
        u => !u.is_complete && new Date(u.last_activity_at) < threeDaysAgo
      );
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        u =>
          u.email.toLowerCase().includes(term) ||
          `${u.first_name} ${u.last_name}`.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  const exportData = () => {
    const csv = [
      ['Email', 'Name', 'Progress', 'Status', 'Last Activity', 'Time Spent (min)'],
      ...getFilteredUsers().map(u => [
        u.email,
        `${u.first_name} ${u.last_name}`,
        `${u.current_step}/${u.total_steps}`,
        u.is_complete ? 'Completed' : 'In Progress',
        new Date(u.last_activity_at).toLocaleDateString(),
        u.time_spent_minutes.toString(),
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `onboarding-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading onboarding data..." />;
  }

  const filteredUsers = getFilteredUsers();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Onboarding Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track new member onboarding progress
          </p>
        </div>
        <Button
          variant="outline"
          leftIcon={<Download className="w-5 h-5" />}
          onClick={exportData}
        >
          Export Data
        </Button>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Total Users"
            value={stats.total_users.toString()}
            trend="neutral"
            color="blue"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            label="In Progress"
            value={stats.in_progress.toString()}
            subtitle={`${stats.completion_rate}% completion rate`}
            trend="neutral"
            color="yellow"
          />
          <StatCard
            icon={<UserCheck className="w-6 h-6" />}
            label="Completed"
            value={stats.completed.toString()}
            subtitle={`Avg ${stats.avg_time_to_complete_hours?.toFixed(1) || 0}h to complete`}
            trend="up"
            color="green"
          />
        </div>
      )}

      {stats && stats.stuck_users > 0 && (
        <Card className="bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800">
          <div className="p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                {stats.stuck_users} user{stats.stuck_users !== 1 ? 's' : ''} need attention
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                These users haven't been active in the last 3 days. Consider sending a reminder email.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Filters and Search */}
      <Card>
        <div className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'All', icon: Users },
                { key: 'in_progress', label: 'In Progress', icon: Clock },
                { key: 'stuck', label: 'Stuck', icon: AlertCircle },
                { key: 'completed', label: 'Completed', icon: UserCheck },
              ].map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  size="sm"
                  variant={filter === key ? 'primary' : 'outline'}
                  onClick={() => setFilter(key as any)}
                  leftIcon={<Icon className="w-4 h-4" />}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Time Spent
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.first_name || user.last_name
                          ? `${user.first_name} ${user.last_name}`.trim()
                          : 'No name'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-24">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{
                            width: `${(user.current_step / user.total_steps) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {user.current_step}/{user.total_steps}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.is_complete ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        <UserCheck className="w-3 h-3 mr-1" />
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                        <Clock className="w-3 h-3 mr-1" />
                        In Progress
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {new Date(user.last_activity_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {user.time_spent_minutes} min
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <UserX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No users found matching your filters
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default OnboardingDashboardPage;

