import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, MapPin, Video, CheckCircle2, XCircle, Filter } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../ui/Card';
import { Button } from '../../ui/Button';

interface Session {
  id: string;
  date: string;
  time: string;
  type: string;
  trainer: string;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  duration: number;
  notes?: string;
}

const mockSessions: Session[] = [
  {
    id: '1',
    date: '2025-11-20',
    time: '10:00 AM',
    type: 'Personal Training',
    trainer: 'Coach Mike',
    location: 'In-Person',
    status: 'upcoming',
    duration: 60,
  },
  {
    id: '2',
    date: '2025-11-22',
    time: '2:00 PM',
    type: 'Flex & Mobility',
    trainer: 'Coach Sarah',
    location: 'In-Person',
    status: 'upcoming',
    duration: 60,
  },
  {
    id: '3',
    date: '2025-11-15',
    time: '9:00 AM',
    type: 'Online Coaching',
    trainer: 'Coach Alex',
    location: 'Online',
    status: 'completed',
    duration: 45,
    notes: 'Great session! Focused on form and technique.',
  },
  {
    id: '4',
    date: '2025-11-13',
    time: '11:00 AM',
    type: 'Personal Training',
    trainer: 'Coach Mike',
    location: 'In-Person',
    status: 'completed',
    duration: 60,
    notes: 'Increased weight on squats. Feeling stronger!',
  },
  {
    id: '5',
    date: '2025-11-10',
    time: '3:00 PM',
    type: 'Meal Planning',
    trainer: 'Coach Sarah',
    location: 'Online',
    status: 'completed',
    duration: 30,
  },
  {
    id: '6',
    date: '2025-11-08',
    time: '10:00 AM',
    type: 'Personal Training',
    trainer: 'Coach Mike',
    location: 'In-Person',
    status: 'cancelled',
    duration: 60,
  },
];

export const SessionsSection: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  const filteredSessions = mockSessions.filter((session) => {
    if (filter === 'all') return true;
    return session.status === filter;
  });

  const getStatusBadge = (status: Session['status']) => {
    const badges = {
      upcoming: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      completed: 'bg-green-500/10 text-green-600 dark:text-green-400',
      cancelled: 'bg-red-500/10 text-red-600 dark:text-red-400',
    };
    return badges[status];
  };

  const getStatusIcon = (status: Session['status']) => {
    if (status === 'completed') return <CheckCircle2 className="w-4 h-4" />;
    if (status === 'cancelled') return <XCircle className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
            My Sessions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage your training sessions
          </p>
        </div>
        <Button 
          variant="primary" 
          leftIcon={<Calendar className="w-5 h-5" />}
          onClick={() => navigate('/dashboard/schedule')}
        >
          Book New Session
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="p-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
            <div className="flex gap-2">
              {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                    filter === filterOption
                      ? 'bg-primary text-dark'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <Card key={session.id} className="hover:shadow-lg transition-shadow">
              <CardBody className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Session Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                          {session.type}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusBadge(session.status)}`}>
                            {getStatusIcon(session.status)}
                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{formatDate(session.date)}</span>
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
                        {session.location === 'Online' ? (
                          <Video className="w-4 h-4" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                        <span className="text-sm">{session.location}</span>
                      </div>
                    </div>

                    {session.notes && (
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                          "{session.notes}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {session.status === 'upcoming' && (
                    <div className="flex lg:flex-col gap-2">
                      <Button variant="outline" size="sm" className="flex-1 lg:flex-initial">
                        Reschedule
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1 lg:flex-initial text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          ))
        ) : (
          <Card>
            <CardBody className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No sessions found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {filter === 'all' 
                  ? "You don't have any sessions yet."
                  : `No ${filter} sessions.`}
              </p>
              <Button 
                variant="primary"
                onClick={() => navigate('/dashboard/schedule')}
              >
                Book Your First Session
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

