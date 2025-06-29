import React from 'react';
import { Target, Calendar, Users, CheckCircle, Zap } from 'lucide-react';
import Button from '../Button';

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  progress?: number;
  relatedContacts?: number;
  category?: string;
}

interface GoalCardProps { 
  goal: Goal;
  onToggleComplete: (goal: Goal) => void;
  onEdit: (goal: Goal) => void;
  isUpdating?: boolean;
}

export default function GoalCard({ goal, onToggleComplete, onEdit, isUpdating = false }: GoalCardProps) {
  const isOverdue = !goal.completed && new Date(goal.targetDate) < new Date();
  const daysUntilDue = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  };

  const categoryColors = {
    'Networking': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    'Fundraising': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    'Hiring': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    'Partnerships': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    'Growth': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400'
  };

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <Target className={`w-5 h-5 ${goal.completed ? 'text-green-600' : 'text-indigo-600'}`} />
            <h3 className={`text-lg font-semibold ${goal.completed ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
              {goal.title}
            </h3>
            <div className="flex space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[goal.priority]}`}>
                {goal.priority}
              </span>
              {goal.category && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[goal.category as keyof typeof categoryColors]}`}>
                  {goal.category}
                </span>
              )}
            </div>
          </div>
          <p className={`text-gray-600 dark:text-gray-400 mb-4 ${goal.completed ? 'line-through' : ''}`}>
            {goal.description}
          </p>

          {/* Progress Bar */}
          {!goal.completed && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{goal.progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div 
                  className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                {isOverdue ? 'Overdue' : goal.completed ? 'Completed' : `${daysUntilDue} days left`}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{goal.relatedContacts} connected people</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleComplete(goal)}
            disabled={isUpdating}
          >
            <CheckCircle className={`w-5 h-5 ${goal.completed ? 'text-green-600' : 'text-gray-400'}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(goal)}
          >
            Edit
          </Button>
          <Button variant="outline" size="sm" icon={Zap}>
            Find Matches
          </Button>
        </div>
      </div>
    </div>
  );
}