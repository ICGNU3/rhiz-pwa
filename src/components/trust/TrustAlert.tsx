import React from 'react';
import { AlertTriangle, Clock, User, TrendingDown } from 'lucide-react';
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
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
      case 'low': return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
      default: return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'medium': return <TrendingDown className="w-5 h-5 text-yellow-600" />;
      case 'low': return <AlertTriangle className="w-5 h-5 text-blue-600" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    return 'text-red-600 bg-red-100 dark:bg-red-900/20';
  };

  return (
    <div className={`p-5 rounded-xl border ${getSeverityColor(alert.severity)} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {getSeverityIcon(alert.severity)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {alert.contact}
                </h4>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getTrustScoreColor(alert.trustScore)}`}>
                Trust: {alert.trustScore}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                alert.severity === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
              }`}>
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
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onAction?.(alert.id, alert.action)}
              className={`${
                alert.severity === 'high' ? 'border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400' :
                alert.severity === 'medium' ? 'border-yellow-300 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-400' :
                'border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400'
              }`}
            >
              {alert.action}
            </Button>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onAction?.(alert.id, 'view-profile')}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                View Profile
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onAction?.(alert.id, 'dismiss')}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}