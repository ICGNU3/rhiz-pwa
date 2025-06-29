import React from 'react';
import { Zap, AlertTriangle, Target, Clock, TrendingUp, Users } from 'lucide-react';
import Button from '../Button';

interface RelationshipAlert { 
  type: 'opportunity' | 'risk' | 'milestone';
  contact: string; 
  message: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  timestamp?: string;
  category?: string;
}

interface RelationshipAlertsProps { 
  alerts: RelationshipAlert[]; 
}

export default function RelationshipAlerts({ alerts }: RelationshipAlertsProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Zap className="w-5 h-5 text-green-600" />;
      case 'risk': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'milestone': return <Target className="w-5 h-5 text-blue-600" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColors = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
      case 'low': return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
      default: return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'opportunity': return 'Opportunity';
      case 'risk': return 'Risk Alert';
      case 'milestone': return 'Milestone';
      default: return 'Alert';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'text-green-700 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'risk': return 'text-red-700 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'milestone': return 'text-blue-700 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'text-gray-700 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Relationship Intelligence Alerts
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered insights about your network activity and opportunities
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" icon={TrendingUp}>
          View Analytics
        </Button>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-3">
            <Zap className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-lg font-bold text-green-800 dark:text-green-400">
                {alerts.filter(a => a.type === 'opportunity').length}
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">New Opportunities</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <p className="text-lg font-bold text-red-800 dark:text-red-400">
                {alerts.filter(a => a.type === 'risk').length}
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">Risk Alerts</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-3">
            <Target className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-lg font-bold text-blue-800 dark:text-blue-400">
                {alerts.filter(a => a.type === 'milestone').length}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Milestones</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <div key={index} className={`p-5 rounded-xl border ${getPriorityColors(alert.priority)} transition-all duration-200 hover:shadow-md`}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {getIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {alert.contact}
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(alert.type)}`}>
                      {getTypeLabel(alert.type)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      alert.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                      alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    }`}>
                      {alert.priority.toUpperCase()}
                    </span>
                    {alert.timestamp && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{alert.timestamp}</span>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  {alert.message}
                </p>
                <div className="flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`${
                      alert.type === 'opportunity' ? 'border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400' :
                      alert.type === 'risk' ? 'border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400' :
                      'border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400'
                    }`}
                  >
                    {alert.action}
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" icon={Users} className="text-gray-500 hover:text-gray-700">
                      View Network
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {alerts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No alerts at the moment
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your AI assistant is monitoring your network for opportunities and risks.
          </p>
        </div>
      )}
    </div>
  );
}