import React from 'react';
import { Target, Calendar, Users, CheckCircle, Zap, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
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
    low: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200',
    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200'
  };

  const categoryColors = {
    'Networking': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200',
    'Fundraising': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200',
    'Hiring': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200',
    'Partnerships': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200',
    'Growth': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400 border-pink-200'
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'from-green-500 to-emerald-600';
    if (progress >= 60) return 'from-blue-500 to-indigo-600';
    if (progress >= 40) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  return (
    <div className="p-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full transform rotate-45 scale-150"></div>
      </div>

      <div className="relative">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-2 rounded-lg ${goal.completed ? 'bg-green-100 dark:bg-green-900/20' : 'bg-indigo-100 dark:bg-indigo-900/20'}`}>
                <Target className={`w-5 h-5 ${goal.completed ? 'text-green-600' : 'text-indigo-600'}`} />
              </div>
              <h3 className={`text-xl font-bold ${goal.completed ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                {goal.title}
              </h3>
            </div>
            
            <div className="flex items-center space-x-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${priorityColors[goal.priority]}`}>
                {goal.priority.toUpperCase()} PRIORITY
              </span>
              {goal.category && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${categoryColors[goal.category as keyof typeof categoryColors]}`}>
                  {goal.category.toUpperCase()}
                </span>
              )}
              {isOverdue && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border border-red-200 flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>OVERDUE</span>
                </span>
              )}
            </div>

            <p className={`text-gray-600 dark:text-gray-400 mb-6 leading-relaxed ${goal.completed ? 'line-through' : ''}`}>
              {goal.description}
            </p>

            {/* Enhanced Progress Section */}
            {!goal.completed && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{goal.progress}%</span>
                </div>
                <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${getProgressColor(goal.progress || 0)} rounded-full transition-all duration-1000 ease-out relative`}
                    style={{ width: `${goal.progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Started</span>
                  <span className="font-medium">{goal.progress}% Complete</span>
                  <span>Target</span>
                </div>
              </div>
            )}

            {/* Enhanced Metadata */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Calendar className={`w-5 h-5 ${isOverdue ? 'text-red-500' : 'text-gray-500'}`} />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">DEADLINE</p>
                  <p className={`text-sm font-semibold ${isOverdue ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                    {isOverdue ? 'Overdue' : goal.completed ? 'Completed' : `${daysUntilDue} days left`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Users className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">NETWORK</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {goal.relatedContacts} people connected
                  </p>
                </div>
              </div>
            </div>

            {/* Completion Badge */}
            {goal.completed && (
              <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800 dark:text-green-400">
                  Goal completed! Great work on achieving this milestone.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleComplete(goal)}
              disabled={isUpdating}
              className="flex items-center space-x-2"
            >
              <CheckCircle className={`w-4 h-4 ${goal.completed ? 'text-green-600' : 'text-gray-400'}`} />
              <span>{goal.completed ? 'Completed' : 'Mark Complete'}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(goal)}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Edit Goal
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              icon={Zap}
              className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 text-indigo-700 hover:from-indigo-100 hover:to-purple-100"
            >
              AI Match
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              icon={Users}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100"
            >
              View Network
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}