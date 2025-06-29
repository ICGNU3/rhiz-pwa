import React from 'react';
import { Zap, AlertTriangle, Target } from 'lucide-react';
import Button from '../Button';

interface RelationshipAlert { 
  type: 'opportunity' | 'risk' | 'milestone';
  contact: string; 
  message: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
}

interface RelationshipAlertsProps { 
  alerts: RelationshipAlert[]; 
}

export default function RelationshipAlerts({ alerts }: RelationshipAlertsProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Zap className="w-5 h-5 text-green-600" />;
      case 'risk': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Relationship Alerts
        </h3>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <div key={index} className={`p-4 rounded-lg border ${getPriorityColors(alert.priority)}`}>
            <div className="flex items-start space-x-3">
              {getIcon(alert.type)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {alert.contact}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    alert.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                    alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  }`}>
                    {alert.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {alert.message}
                </p>
                <Button variant="outline" size="sm">
                  {alert.action}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}