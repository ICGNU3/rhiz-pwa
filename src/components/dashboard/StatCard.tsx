import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        </div>
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-aqua to-emerald">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${
            trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard; 