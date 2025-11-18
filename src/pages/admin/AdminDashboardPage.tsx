import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Activity,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Crown
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Line, Bar } from 'recharts';
import { LineChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data
const revenueData = [
  { month: 'Jun', revenue: 12400, sessions: 45 },
  { month: 'Jul', revenue: 15200, sessions: 52 },
  { month: 'Aug', revenue: 18900, sessions: 61 },
  { month: 'Sep', revenue: 21500, sessions: 68 },
  { month: 'Oct', revenue: 24300, sessions: 75 },
  { month: 'Nov', revenue: 28900, sessions: 82 },
];

const clientsByPlan = [
  { plan: 'Basic', count: 24, revenue: 4296 },
  { plan: 'Pro', count: 18, revenue: 6282 },
  { plan: 'Elite', count: 12, revenue: 7188 },
];

const recentBookings = [
  { id: '1', client: 'John Smith', service: 'Personal Training', date: '2025-11-20', time: '10:00 AM', status: 'confirmed' as const },
  { id: '2', client: 'Sarah Johnson', service: 'Online Coaching', date: '2025-11-20', time: '2:00 PM', status: 'pending' as const },
  { id: '3', client: 'Mike Wilson', service: 'Meal Planning', date: '2025-11-21', time: '9:00 AM', status: 'confirmed' as const },
  { id: '4', client: 'Emily Davis', service: 'Flex & Mobility', date: '2025-11-21', time: '11:00 AM', status: 'cancelled' as const },
];

const recentClients = [
  { id: '1', name: 'Alex Thompson', email: 'alex@example.com', plan: 'Pro', joined: '2025-11-15', status: 'active' as const },
  { id: '2', name: 'Lisa Martinez', email: 'lisa@example.com', plan: 'Elite', joined: '2025-11-14', status: 'active' as const },
  { id: '3', name: 'Chris Anderson', email: 'chris@example.com', plan: 'Basic', joined: '2025-11-13', status: 'active' as const },
  { id: '4', name: 'Rachel Green', email: 'rachel@example.com', plan: 'Pro', joined: '2025-11-12', status: 'onboarding' as const },
];

export const AdminDashboardPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const getStatusBadge = (status: 'confirmed' | 'pending' | 'cancelled' | 'active' | 'onboarding') => {
    const badges = {
      confirmed: 'bg-green-500/10 text-green-600 dark:text-green-400',
      pending: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
      cancelled: 'bg-red-500/10 text-red-600 dark:text-red-400',
      active: 'bg-green-500/10 text-green-600 dark:text-green-400',
      onboarding: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    };
    return badges[status];
  };

  const getStatusIcon = (status: 'confirmed' | 'pending' | 'cancelled') => {
    if (status === 'confirmed') return <CheckCircle className="w-4 h-4" />;
    if (status === 'cancelled') return <XCircle className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-24 md:pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your fitness business.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <Card>
            <CardBody className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">$28,900</p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +18.7% from last month
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Active Clients */}
          <Card>
            <CardBody className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Clients</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">54</p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +4 new this week
                  </p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Sessions This Month */}
          <Card>
            <CardBody className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sessions This Month</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">82</p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +9.5% from last month
                  </p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Pending Actions */}
          <Card>
            <CardBody className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending Actions</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">7</p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Requires attention
                  </p>
                </div>
                <div className="p-3 bg-yellow-500/10 rounded-lg">
                  <Activity className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                  Revenue & Sessions
                </h2>
                <div className="flex gap-2">
                  {(['week', 'month', 'year'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        selectedPeriod === period
                          ? 'bg-primary text-black'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#6AFFB7" strokeWidth={2} name="Revenue ($)" />
                  <Line type="monotone" dataKey="sessions" stroke="#60A5FA" strokeWidth={2} name="Sessions" />
                </LineChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          {/* Clients by Plan */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                Clients by Plan
              </h2>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={clientsByPlan}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="plan" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Bar dataKey="count" fill="#6AFFB7" name="Clients" />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                  Recent Bookings
                </h2>
                <Link to="/admin/sessions">
                  <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {booking.client}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {booking.service} • {booking.date} at {booking.time}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusBadge(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Recent Clients */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                  Recent Clients
                </h2>
                <Link to="/admin/clients">
                  <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {recentClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {client.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {client.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <Crown className="w-3 h-3" />
                        {client.plan}
                      </div>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(client.status)}`}>
                        {client.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/clients">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-primary">
              <CardBody className="p-6 flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Manage Clients</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">View and edit client profiles</p>
                </div>
              </CardBody>
            </Card>
          </Link>

          <Link to="/admin/sessions">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-primary">
              <CardBody className="p-6 flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Manage Sessions</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">View and schedule sessions</p>
                </div>
              </CardBody>
            </Card>
          </Link>

          <Link to="/admin/reports">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-primary">
              <CardBody className="p-6 flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Financial Reports</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Revenue and transactions</p>
                </div>
              </CardBody>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
