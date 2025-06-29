import React from 'react';
import { Target, CheckCircle, TrendingUp, Users } from 'lucide-react';
import Card from '../Card';

interface GoalStatsProps { 
  activeGoals: number;
  completedGoals: number;
  avgProgress: number;
  connectedPeople: number;
}

export default function GoalStats({ 
  activeGoals, 
  completedGoals, 
  avgProgress, 
  connectedPeople 
}: GoalStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <Target className="w-8 h-8 text-indigo-600" />
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeGoals}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Goals</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-8 h-8 text-green-600" />
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedGoals}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-8 h-8 text-blue-600" />
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgProgress}%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Progress</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-purple-600" />
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {connectedPeople}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Connected People</p>
          </div>
        </div>
      </Card>
    </div>
  );
}