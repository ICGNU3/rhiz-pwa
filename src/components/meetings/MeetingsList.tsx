import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Video, ExternalLink, Search } from 'lucide-react';
import { Meeting } from '../../api/integrations';
import { integrationsAPI } from '../../api/integrations';
import Card from '../Card';
import Button from '../ui/Button';
import Spinner from '../Spinner';

interface MeetingsListProps {
  className?: string;
}

const MeetingsList: React.FC<MeetingsListProps> = ({ className = '' }) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    setLoading(true);
    setError(null);

    try {
      const statuses = await integrationsAPI.getStatus();
      const allMeetings: Meeting[] = [];

      // Load meetings from each connected integration
      for (const status of statuses) {
        if (status.connected) {
          try {
            const result = await integrationsAPI.syncMeetings(status.provider);
            allMeetings.push(...result);
          } catch (err) {
            console.error(`Failed to sync ${status.provider}:`, err);
          }
        }
      }

      // Sort by start time (most recent first)
      allMeetings.sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
      setMeetings(allMeetings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.participants.some(p => 
                           p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           p.email.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesSource = filterSource === 'all' || meeting.source === filterSource;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'upcoming' && new Date(meeting.start_time) > new Date()) ||
                         (filterStatus === 'past' && new Date(meeting.start_time) <= new Date());

    return matchesSearch && matchesSource && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'calendly':
        return <Calendar className="w-4 h-4" />;
      case 'zoom':
        return <Video className="w-4 h-4" />;
      case 'google-meet':
        return <Video className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'calendly':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'zoom':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'google-meet':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <Spinner size="lg" className="mr-3" />
          <span className="text-gray-600 dark:text-gray-400">Loading meetings...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="text-red-600 mb-2">Failed to load meetings</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</div>
          <Button onClick={loadMeetings} variant="outline" size="sm">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Meetings</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filteredMeetings.length} meeting{filteredMeetings.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <Button onClick={loadMeetings} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search meetings or participants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <select
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">All Sources</option>
          <option value="calendly">Calendly</option>
          <option value="zoom">Zoom</option>
          <option value="google-meet">Google Meet</option>
        </select>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">All Meetings</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {filteredMeetings.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No meetings found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterSource !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Connect your calendar services to see your meetings here'
              }
            </p>
          </div>
        ) : (
          filteredMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className={`p-4 border rounded-lg transition-colors ${
                isUpcoming(meeting.start_time)
                  ? 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/10'
                  : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {meeting.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(meeting.source)}`}>
                      {getSourceIcon(meeting.source)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDate(meeting.start_time)}
                    </div>
                    {meeting.duration && (
                      <div className="flex items-center gap-1">
                        <span>•</span>
                        <span>{Math.round(meeting.duration / 60)} min</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {meeting.participants.length} participant{meeting.participants.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                
                {meeting.join_url && isUpcoming(meeting.start_time) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(meeting.join_url, '_blank')}
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Join
                  </Button>
                )}
              </div>
              
              {/* Participants */}
              {meeting.participants.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Participants
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {meeting.participants.slice(0, 5).map((participant, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"
                      >
                        <span className="font-medium">{participant.name}</span>
                        {participant.status && (
                          <span className={`px-1 rounded text-xs ${
                            participant.status === 'accepted' ? 'bg-green-100 text-green-700' :
                            participant.status === 'declined' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {participant.status}
                          </span>
                        )}
                      </div>
                    ))}
                    {meeting.participants.length > 5 && (
                      <span className="text-xs text-gray-500">
                        +{meeting.participants.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default MeetingsList; 