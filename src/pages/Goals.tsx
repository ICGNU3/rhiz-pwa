import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Target, Filter, Calendar, TrendingUp, Users, Zap, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import ErrorBorder from '../components/ErrorBorder';
import GoalCard from '../components/goals/GoalCard';
import GoalStats from '../components/goals/GoalStats';
import { getGoals, createGoal, updateGoal } from '../api/goals';

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

const Goals: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const queryClient = useQueryClient();

  const { data: goals, isLoading, error, refetch } = useQuery({
    queryKey: ['goals'],
    queryFn: getGoals,
  });

  const createMutation = useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setIsModalOpen(false);
      setEditingGoal(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setIsModalOpen(false);
      setEditingGoal(null);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const goalData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      targetDate: formData.get('targetDate') as string,
      priority: formData.get('priority') as 'low' | 'medium' | 'high',
      category: formData.get('category') as string,
      completed: false,
    };

    if (editingGoal) {
      updateMutation.mutate({ ...goalData, id: editingGoal.id, completed: editingGoal.completed });
    } else {
      createMutation.mutate(goalData);
    }
  };

  const toggleComplete = (goal: Goal) => {
    updateMutation.mutate({ ...goal, completed: !goal.completed });
  };

  // Enhance goals with mock progress and related data
  const enhancedGoals = goals?.map((goal: Goal) => ({
    ...goal,
    progress: Math.floor(Math.random() * 100),
    relatedContacts: Math.floor(Math.random() * 5) + 1,
    category: ['Networking', 'Fundraising', 'Hiring', 'Partnerships', 'Growth'][Math.floor(Math.random() * 5)]
  }));

  const filteredGoals = enhancedGoals?.filter((goal: Goal) => {
    if (filterBy === 'all') return true;
    if (filterBy === 'active') return !goal.completed;
    if (filterBy === 'completed') return goal.completed;
    if (filterBy === 'overdue') {
      const today = new Date();
      const targetDate = new Date(goal.targetDate);
      return !goal.completed && targetDate < today;
    }
    if (filterBy === 'high-priority') return goal.priority === 'high';
    return true;
  })?.sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === 'progress') {
      return (b.progress || 0) - (a.progress || 0);
    }
    if (sortBy === 'deadline') {
      return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
    }
    return 0;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your goals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Goals</h1>
        </div>
        <ErrorBorder 
          message="Failed to load your goals. Please check your connection and try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const activeGoals = enhancedGoals?.filter(g => !g.completed).length || 0;
  const completedGoals = enhancedGoals?.filter(g => g.completed).length || 0;
  const avgProgress = enhancedGoals?.length ? 
    Math.round(enhancedGoals.reduce((sum, g) => sum + (g.progress || 0), 0) / enhancedGoals.length) : 0;
  const connectedPeople = enhancedGoals?.reduce((sum, g) => sum + (g.relatedContacts || 0), 0) || 0;
  const overdueGoals = enhancedGoals?.filter(g => !g.completed && new Date(g.targetDate) < new Date()).length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Goal Intelligence
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              AI-powered goal tracking with smart relationship matching
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              icon={Zap}
              className="bg-white/80 backdrop-blur-sm border-indigo-200 hover:bg-indigo-50"
            >
              AI Insights
            </Button>
            <Button 
              icon={Plus} 
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25"
            >
              New Goal
            </Button>
          </div>
        </div>

        {/* Enhanced Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl shadow-blue-500/25">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Active Goals</p>
                <p className="text-3xl font-bold">{activeGoals}</p>
                <p className="text-blue-200 text-xs mt-1">+2 this week</p>
              </div>
              <Target className="w-8 h-8 text-blue-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl shadow-green-500/25">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold">{completedGoals}</p>
                <p className="text-green-200 text-xs mt-1">+3 this month</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl shadow-purple-500/25">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Avg Progress</p>
                <p className="text-3xl font-bold">{avgProgress}%</p>
                <p className="text-purple-200 text-xs mt-1">+12% this week</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-xl shadow-orange-500/25">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Overdue</p>
                <p className="text-3xl font-bold">{overdueGoals}</p>
                <p className="text-orange-200 text-xs mt-1">Needs attention</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-indigo-500 to-pink-600 text-white border-0 shadow-xl shadow-indigo-500/25">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm font-medium">Network</p>
                <p className="text-3xl font-bold">{connectedPeople}</p>
                <p className="text-indigo-200 text-xs mt-1">Connected people</p>
              </div>
              <Users className="w-8 h-8 text-indigo-200" />
            </div>
          </Card>
        </div>

        {/* AI Insights Panel */}
        <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Goal Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Smart Recommendation</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect with Sarah Chen for your fundraising goal - she just joined Stanford's AI committee.
              </p>
            </div>
            <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Progress Alert</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your hiring goal is 70% complete. Schedule 3 more interviews to reach your target.
              </p>
            </div>
            <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Network Opportunity</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                5 mutual connections could help with your partnership goals. View suggestions.
              </p>
            </div>
          </div>
        </Card>

        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
              {['all', 'active', 'completed', 'overdue', 'high-priority'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterBy(filter)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    filterBy === filter
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="priority">Sort by Priority</option>
                <option value="progress">Sort by Progress</option>
                <option value="deadline">Sort by Deadline</option>
              </select>
            </div>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="space-y-6">
          {filteredGoals && filteredGoals.length > 0 ? (
            <div className="grid gap-6">
              {filteredGoals.map((goal: Goal, index: number) => (
                <div
                  key={goal.id}
                  className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card 
                    hover 
                    className={`overflow-hidden border-0 shadow-lg ${
                      goal.completed 
                        ? 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 opacity-75' 
                        : 'bg-white dark:bg-gray-800 shadow-xl'
                    }`}
                  >
                    <GoalCard
                      goal={goal}
                      onToggleComplete={toggleComplete}
                      onEdit={(goal) => {
                        setEditingGoal(goal);
                        setIsModalOpen(true);
                      }}
                      isUpdating={updateMutation.isPending}
                    />
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-16 text-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {filterBy === 'all' ? 'No goals yet' : `No ${filterBy} goals`}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  {filterBy === 'all' 
                    ? 'Transform your ambitions into achievable goals. Let AI help you find the right people and strategies to succeed.'
                    : `You don't have any ${filterBy} goals at the moment. Create a new goal to get started.`
                  }
                </p>
                <Button 
                  icon={Plus} 
                  onClick={() => setIsModalOpen(true)}
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25"
                >
                  Create Your First Goal
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Goal Creation/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingGoal(null);
          }}
          title={editingGoal ? 'Edit Goal' : 'Create New Goal'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Goal Title *
                </label>
                <input
                  name="title"
                  type="text"
                  required
                  defaultValue={editingGoal?.title}
                  className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="e.g., Raise $2M Series A funding"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={editingGoal?.description}
                  className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="Describe your goal, success metrics, and what you hope to achieve..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Target Date *
                  </label>
                  <input
                    name="targetDate"
                    type="date"
                    required
                    defaultValue={editingGoal?.targetDate}
                    className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Priority
                  </label>
                  <select
                    name="priority"
                    defaultValue={editingGoal?.priority || 'medium'}
                    className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Category
                  </label>
                  <select
                    name="category"
                    defaultValue={editingGoal?.category || 'Networking'}
                    className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Networking">Networking</option>
                    <option value="Fundraising">Fundraising</option>
                    <option value="Hiring">Hiring</option>
                    <option value="Partnerships">Partnerships</option>
                    <option value="Growth">Growth</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingGoal(null);
                }}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={createMutation.isPending || updateMutation.isPending}
                className="px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {editingGoal ? 'Update Goal' : 'Create Goal'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Goals;