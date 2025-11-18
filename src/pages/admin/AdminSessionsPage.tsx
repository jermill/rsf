import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Video,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

interface Session {
  id: string;
  client: string;
  clientEmail: string;
  service: string;
  trainer: string;
  date: string;
  time: string;
  duration: number;
  location: 'in-person' | 'online';
  status: 'upcoming' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  price: number;
  notes?: string;
}

const mockSessions: Session[] = [
  {
    id: '1',
    client: 'John Smith',
    clientEmail: 'john.smith@example.com',
    service: 'Personal Training',
    trainer: 'Coach Mike',
    date: '2025-11-20',
    time: '10:00 AM',
    duration: 60,
    location: 'in-person',
    status: 'confirmed',
    price: 80,
  },
  {
    id: '2',
    client: 'Sarah Johnson',
    clientEmail: 'sarah.j@example.com',
    service: 'Online Coaching',
    trainer: 'Coach Sarah',
    date: '2025-11-20',
    time: '2:00 PM',
    duration: 45,
    location: 'online',
    status: 'upcoming',
    price: 60,
  },
  {
    id: '3',
    client: 'Mike Wilson',
    clientEmail: 'mike.wilson@example.com',
    service: 'Meal Planning',
    trainer: 'Coach Sarah',
    date: '2025-11-21',
    time: '9:00 AM',
    duration: 30,
    location: 'online',
    status: 'confirmed',
    price: 50,
  },
  {
    id: '4',
    client: 'Emily Davis',
    clientEmail: 'emily.d@example.com',
    service: 'Flex & Mobility',
    trainer: 'Coach Alex',
    date: '2025-11-21',
    time: '11:00 AM',
    duration: 60,
    location: 'in-person',
    status: 'cancelled',
    price: 120,
    notes: 'Client requested cancellation due to illness',
  },
  {
    id: '5',
    client: 'Alex Thompson',
    clientEmail: 'alex.t@example.com',
    service: 'Personal Training',
    trainer: 'Coach Mike',
    date: '2025-11-18',
    time: '3:00 PM',
    duration: 60,
    location: 'in-person',
    status: 'completed',
    price: 80,
  },
  {
    id: '6',
    client: 'Lisa Martinez',
    clientEmail: 'lisa.m@example.com',
    service: 'Online Coaching',
    trainer: 'Coach Alex',
    date: '2025-11-17',
    time: '1:00 PM',
    duration: 45,
    location: 'online',
    status: 'no-show',
    price: 60,
    notes: 'Client did not attend. No response to follow-up.',
  },
];

export const AdminSessionsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<'all' | Session['status']>('all');
  const [locationFilter, setLocationFilter] = useState<'all' | Session['location']>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const filteredSessions = mockSessions.filter((session) => {
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || session.location === locationFilter;
    
    // Simple date filtering
    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = session.date === '2025-11-20'; // Mock today
    } else if (dateFilter === 'week') {
      matchesDate = session.date >= '2025-11-18' && session.date <= '2025-11-24';
    }
    
    return matchesStatus && matchesLocation && matchesDate;
  });

  const getStatusBadge = (status: Session['status']) => {
    const badges = {
      upcoming: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      confirmed: 'bg-green-500/10 text-green-600 dark:text-green-400',
      completed: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
      cancelled: 'bg-red-500/10 text-red-600 dark:text-red-400',
      'no-show': 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    };
    return badges[status];
  };

  const getStatusIcon = (status: Session['status']) => {
    if (status === 'completed' || status === 'confirmed') return <CheckCircle className="w-4 h-4" />;
    if (status === 'cancelled' || status === 'no-show') return <XCircle className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  const upcomingCount = mockSessions.filter(s => s.status === 'upcoming' || s.status === 'confirmed').length;
  const completedCount = mockSessions.filter(s => s.status === 'completed').length;
  const cancelledCount = mockSessions.filter(s => s.status === 'cancelled' || s.status === 'no-show').length;
  const totalRevenue = mockSessions.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-24 md:pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">
              Session Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage all client sessions
            </p>
          </div>
          <Button variant="primary" leftIcon={<Plus className="w-5 h-5" />}>
            Book New Session
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Upcoming</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{upcomingCount}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{completedCount}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cancelled</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{cancelledCount}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Revenue</p>
              <p className="text-3xl font-bold text-primary">${totalRevenue}</p>
            </CardBody>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardBody className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Date Filter */}
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as any)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
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
                  <option value="upcoming">Upcoming</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No-Show</option>
                </select>
              </div>

              {/* Location Filter */}
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value as any)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Locations</option>
                  <option value="in-person">In-Person</option>
                  <option value="online">Online</option>
                </select>
              </div>

              <div className="flex-1"></div>

              {/* Export Button */}
              <Button variant="outline" leftIcon={<Download className="w-5 h-5" />}>
                Export
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Sessions List */}
        <div className="space-y-4">
          {filteredSessions.map((session) => (
            <Card key={session.id} className="hover:shadow-lg transition-shadow">
              <CardBody className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Session Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                          {session.service}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusBadge(session.status)}`}>
                            {getStatusIcon(session.status)}
                            {session.status.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <User className="w-4 h-4" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{session.client}</p>
                          <p className="text-xs">{session.clientEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(session.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{session.time} ({session.duration} min)</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <User className="w-4 h-4" />
                        <span className="text-sm">{session.trainer}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        {session.location === 'online' ? (
                          <Video className="w-4 h-4" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                        <span className="text-sm capitalize">{session.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <span className="text-sm font-semibold text-primary">${session.price}</span>
                      </div>
                    </div>

                    {session.notes && (
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {session.notes}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2">
                    {(session.status === 'upcoming' || session.status === 'confirmed') && (
                      <>
                        <Button variant="outline" size="sm" className="flex-1 lg:flex-initial">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex-1 lg:flex-initial text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </>
                    )}
                    {session.status === 'completed' && (
                      <Button variant="outline" size="sm" className="flex-1 lg:flex-initial">
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}

          {/* No Results */}
          {filteredSessions.length === 0 && (
            <Card>
              <CardBody className="p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No sessions found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  No sessions match your current filters.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setStatusFilter('all');
                    setLocationFilter('all');
                    setDateFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSessionsPage;

