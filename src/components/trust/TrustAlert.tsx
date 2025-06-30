import React from 'react';
import { AlertTriangle, Clock, User, TrendingDown, CheckCircle, X, MessageSquare, Eye } from 'lucide-react';
import Button from '../Button';

interface TrustAlert {
  id: string;
  contact: string;
  reason: string;
  trustScore: number;
  severity: 'high' | 'medium' | 'low';
  action: string;
  timestamp: string;
}

interface TrustAlertProps {
  alert: TrustAlert;
  onAction?: (alertId: string, action: string) => void;
}

export default function TrustAlert({ alert, onAction }: TrustAlertProps) {
  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'high': 
        return {
          bgColor: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20',
          icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
          badgeColor: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
          actionColor: 'border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400'
        };
      case 'medium': 
        return {
          bgColor: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20',
          icon: <TrendingDown className="w-5 h-5 text-yellow-600" />,
          badgeColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
          actionColor: 'border-yellow-300 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-400'
        };
      case 'low': 
        return {
          bgColor: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20',
          icon: <AlertTriangle className="w-5 h-5 text-blue-600" />,
          badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
          actionColor: 'border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400'
        };
      default: 
        return {
          bgColor: 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700',
          icon: <AlertTriangle className="w-5 h-5 text-gray-600" />,
          badgeColor: 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400',
          actionColor: 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400'
        };
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    return 'text-red-600 bg-red-100 dark:bg-red-900/20';
  };

  const config = getSeverityConfig(alert.severity);

  return (
    <div className={`p-5 rounded-xl border ${config.bgColor} transition-all duration-200 hover:shadow-md group`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 mt-1">
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                  {alert.contact}
                </h4>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getTrustScoreColor(alert.trustScore)}`}>
                Trust: {alert.trustScore}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${config.badgeColor}`}>
                {alert.severity.toUpperCase()}
              </span>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{alert.timestamp}</span>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
            {alert.reason}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onAction?.(alert.id, alert.action.toLowerCase().replace(' ', '-'))}
                className={`${config.actionColor} transition-all duration-200`}
              >
                {alert.action}
              </Button>
              
              {alert.severity === 'high' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onAction?.(alert.id, 'urgent-follow-up')}
                  className="border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400"
                >
                  Urgent Follow-up
                </Button>
              )}
            </div>
            
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onAction?.(alert.id, 'view-profile')}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                icon={Eye}
              >
                View Profile
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onAction?.(alert.id, 'send-message')}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                icon={MessageSquare}
              >
                Message
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onAction?.(alert.id, 'dismiss')}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                icon={X}
              >
                Dismiss
              </Button>
            </div>
          </div>

          {/* Additional context for high severity alerts */}
          {alert.severity === 'high' && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-red-700 dark:text-red-300">
                  <p className="font-medium mb-1">High Priority Alert</p>
                  <p>This relationship requires immediate attention to prevent further deterioration. Consider scheduling a call or meeting within the next 48 hours.</p>
                </div>
              </div>
            </div>
          )}

          {/* Success state for resolved alerts */}
          {alert.action === 'Resolved' && (
            <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-700 dark:text-green-300">
                  Alert resolved - relationship health improved
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}