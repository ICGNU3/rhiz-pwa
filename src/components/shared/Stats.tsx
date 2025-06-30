import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import Card from '../Card';

interface StatItem {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description?: string;
  change?: string;
}

interface StatsProps {
  stats: StatItem[];
  className?: string;
}

export default function Stats({ stats, className = '' }: StatsProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="p-4" hover>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-light text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm font-light text-gray-900 dark:text-white">
                  {stat.title}
                </p>
                {stat.description && (
                  <p className="text-xs font-light text-gray-600 dark:text-gray-400">
                    {stat.description}
                  </p>
                )}
                {stat.change && (
                  <p className="text-xs font-light text-green-600 mt-1">
                    {stat.change}
                  </p>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}