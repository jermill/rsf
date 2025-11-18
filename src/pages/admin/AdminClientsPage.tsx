import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Crown,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: 'Basic' | 'Pro' | 'Elite';
  status: 'active' | 'onboarding' | 'paused' | 'cancelled';
  joined: string;
  nextSession: string | null;
  totalSessions: number;
  revenue: number;
  avatar?: string;
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    plan: 'Pro',
    status: 'active',
    joined: '2025-08-15',
    nextSession: '2025-11-20',
    totalSessions: 24,
    revenue: 8376,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 234-5678',
    plan: 'Elite',
    status: 'active',
    joined: '2025-07-22',
    nextSession: '2025-11-19',
    totalSessions: 32,
    revenue: 19168,
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.wilson@example.com',
    phone: '(555) 345-6789',
    plan: 'Basic',
    status: 'active',
    joined: '2025-09-10',
    nextSession: '2025-11-21',
    totalSessions: 12,
    revenue: 2148,
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    phone: '(555) 456-7890',
    plan: 'Pro',
    status: 'onboarding',
    joined: '2025-11-15',
    nextSession: null,
    totalSessions: 0,
    revenue: 349,
  },
  {
    id: '5',
    name: 'Alex Thompson',
    email: 'alex.t@example.com',
    phone: '(555) 567-8901',
    plan: 'Elite',
    status: 'active',
    joined: '2025-06-05',
    nextSession: '2025-11-18',
    totalSessions: 48,
    revenue: 28752,
  },
  {
    id: '6',
    name: 'Lisa Martinez',
    email: 'lisa.m@example.com',
    phone: '(555) 678-9012',
    plan: 'Pro',
    status: 'paused',
    joined: '2025-05-18',
    nextSession: null,
    totalSessions: 18,
    revenue: 6282,
  },
];

export const AdminClientsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Client['status']>('all');
  const [planFilter, setPlanFilter] = useState<'all' | Client['plan']>('all');

  const filteredClients = mockClients.filter((client) => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesPlan = planFilter === 'all' || client.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusBadge = (status: Client['status']) => {
    const badges = {
      active: 'bg-green-500/10 text-green-600 dark:text-green-400',
      onboarding: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      paused: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
      cancelled: 'bg-red-500/10 text-red-600 dark:text-red-400',
    };
    return badges[status];
  };

  const getPlanColor = (plan: Client['plan']) => {
    const colors = {
      Basic: 'text-gray-600 dark:text-gray-400',
      Pro: 'text-primary',
      Elite: 'text-purple-600 dark:text-purple-400',
    };
    return colors[plan];
  };

  const totalClients = mockClients.length;
  const activeClients = mockClients.filter(c => c.status === 'active').length;
  const totalRevenue = mockClients.reduce((sum, c) => sum + c.revenue, 0);
  const avgRevenue = totalRevenue / totalClients;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-24 md:pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">
              Client Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your clients and track their progress
            </p>
          </div>
          <Button variant="primary" leftIcon={<UserPlus className="w-5 h-5" />}>
            Add New Client
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Clients</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalClients}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Clients</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{activeClients}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-primary">${totalRevenue.toLocaleString()}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Revenue/Client</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">${Math.round(avgRevenue)}</p>
            </CardBody>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardBody className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search clients by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="onboarding">Onboarding</option>
                  <option value="paused">Paused</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Plan Filter */}
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value as any)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Plans</option>
                  <option value="Basic">Basic</option>
                  <option value="Pro">Pro</option>
                  <option value="Elite">Elite</option>
                </select>
              </div>

              {/* Export Button */}
              <Button variant="outline" leftIcon={<Download className="w-5 h-5" />}>
                Export
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Clients Table */}
        <Card>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Sessions
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Next Session
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-semibold">
                              {client.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {client.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Joined {new Date(client.joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {client.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {client.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center gap-1 font-semibold ${getPlanColor(client.plan)}`}>
                          <Crown className="w-4 h-4" />
                          {client.plan}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadge(client.status)}`}>
                          {client.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-gray-900 dark:text-white">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          <span className="font-semibold">{client.totalSessions}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-primary">
                          ${client.revenue.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {client.nextSession ? (
                          <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-white">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(client.nextSession).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* No Results */}
            {filteredClients.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 mb-4">No clients found matching your filters</p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setPlanFilter('all');
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminClientsPage;

