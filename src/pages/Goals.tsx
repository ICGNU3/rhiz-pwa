import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Target } from 'lucide-react';
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
  const connectedPeople = enhancedGoals?.reduce((sum, g) => sum + (g.relatedContacts || 0), 0) || 0;

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
      <GoalStats
        activeGoals={activeGoals}
        completedGoals={completedGoals}
        avgProgress={avgProgress}
        connectedPeople={connectedPeople}
      />

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
        {filteredGoals?.map((goal: Goal) => (
          <Card key={goal.id} hover className={goal.completed ? 'opacity-75' : ''}>
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
        )) || (
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