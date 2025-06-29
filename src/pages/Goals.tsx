import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Target, Calendar, CheckCircle, Clock, TrendingUp, Users, Zap } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import ErrorBorder from '../components/ErrorBorder';
import { getGoals, createGoal, updateGoal } from '../api/goals';

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  progress?: number;
  relatedContacts?: string[];
  category?: string;
}

const Goals: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [filterBy, setFilterBy] = useState('all');
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
    return true;
  });

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Goal-Driven Network</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Define objectives and let Rhiz match you with the right people to achieve them.
          </p>
        </div>
        <Button 
          icon={Plus} 
          onClick={() => setIsModalOpen(true)}
        >
          New Goal
        </Button>
      </div>

      {/* Goal Statistics */}
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
                {enhancedGoals?.reduce((sum, g) => sum + (g.relatedContacts || 0), 0) || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Connected People</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {['all', 'active', 'completed', 'overdue'].map((filter) => (
          <Button
            key={filter}
            variant={filterBy === filter ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilterBy(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </Button>
        ))}
      </div>

      {/* Goals List */}
      <div className="grid gap-6">
        {filteredGoals?.map((goal: Goal) => {
          const isOverdue = !goal.completed && new Date(goal.targetDate) < new Date();
          const daysUntilDue = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <Card key={goal.id} hover className={goal.completed ? 'opacity-75' : ''}>
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
                      onClick={() => toggleComplete(goal)}
                      disabled={updateMutation.isPending}
                    >
                      <CheckCircle className={`w-5 h-5 ${goal.completed ? 'text-green-600' : 'text-gray-400'}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingGoal(goal);
                        setIsModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" icon={Zap}>
                      Find Matches
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        }) || (
          <Card>
            <div className="p-12 text-center">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No goals yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start by creating your first networking goal and let Rhiz help you achieve it.
              </p>
              <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
                Create Your First Goal
              </Button>
            </div>
          </Card>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGoal(null);
        }}
        title={editingGoal ? 'Edit Goal' : 'New Goal'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Goal Title *
            </label>
            <input
              name="title"
              type="text"
              required
              defaultValue={editingGoal?.title}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., Raise $2M Series A funding"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              defaultValue={editingGoal?.description}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Describe your goal and what success looks like..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Date *
              </label>
              <input
                name="targetDate"
                type="date"
                required
                defaultValue={editingGoal?.targetDate}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                name="priority"
                defaultValue={editingGoal?.priority || 'medium'}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                name="category"
                defaultValue={editingGoal?.category || 'Networking'}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Networking">Networking</option>
                <option value="Fundraising">Fundraising</option>
                <option value="Hiring">Hiring</option>
                <option value="Partnerships">Partnerships</option>
                <option value="Growth">Growth</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingGoal(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {editingGoal ? 'Update Goal' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Goals;