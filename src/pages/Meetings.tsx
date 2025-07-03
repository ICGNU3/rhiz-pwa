import React, { useState } from 'react';
import { Calendar, TrendingUp, Users, Clock, BarChart3 } from 'lucide-react';
import MeetingsList from '../components/meetings/MeetingsList';
import Card from '../components/Card';

const Meetings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'meetings' | 'analytics'>('meetings');

  // Mock analytics data - in real app, this would come from the API
  const analyticsData = {
    totalMeetings: 47,
    upcomingMeetings: 8,
    averageParticipants: 4.2,
    mostActiveDay: 'Tuesday',
    topParticipants: [
      { name: 'Sarah Johnson', meetings: 12, email: 'sarah@example.com' },
      { name: 'Mike Chen', meetings: 9, email: 'mike@example.com' },
      { name: 'Alex Rodriguez', meetings: 7, email: 'alex@example.com' },
    ],
    meetingTrends: [
      { month: 'Jan', meetings: 8 },
      { month: 'Feb', meetings: 12 },
      { month: 'Mar', meetings: 10 },
      { month: 'Apr', meetings: 15 },
      { month: 'May', meetings: 13 },
      { month: 'Jun', meetings: 11 },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Meetings
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Track your meetings and interactions across all your calendar services
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('meetings')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'meetings'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>All Meetings</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'meetings' ? (
          <MeetingsList />
        ) : (
          <div className="space-y-6">
            {/* Analytics Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Meetings</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.totalMeetings}</p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.upcomingMeetings}</p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Participants</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.averageParticipants}</p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Most Active Day</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.mostActiveDay}</p>
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Top Participants */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Meeting Participants</h3>
              <div className="space-y-3">
                {analyticsData.topParticipants.map((participant) => (
                  <div key={participant.email} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600">
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{participant.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{participant.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">{participant.meetings} meetings</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {Math.round((participant.meetings / analyticsData.totalMeetings) * 100)}% of total
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Meeting Trends Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Meeting Trends</h3>
              <div className="flex items-end space-x-2 h-32">
                {analyticsData.meetingTrends.map((trend) => {
                  const maxMeetings = Math.max(...analyticsData.meetingTrends.map(t => t.meetings));
                  const height = (trend.meetings / maxMeetings) * 100;
                  
                  return (
                    <div key={trend.month} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-indigo-200 dark:bg-indigo-800 rounded-t transition-all duration-300 hover:bg-indigo-300 dark:hover:bg-indigo-700"
                           style={{ height: `${height}%` }}>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">{trend.month}</span>
                      <span className="text-xs font-medium text-gray-900 dark:text-white">{trend.meetings}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Meetings; 