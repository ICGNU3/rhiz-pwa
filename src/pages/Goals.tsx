import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Target, Zap } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import ErrorBorder from '../components/ErrorBorder';
import GoalCard from '../components/goals/GoalCard';
import GoalStats from '../components/goals/GoalStats';
import GoalForm from '../components/goals/GoalForm';
import GoalFilters from '../components/goals/GoalFilters';
import GoalInsights from '../components/goals/GoalInsights';
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
        <GoalStats 
          activeGoals={activeGoals}
          completedGoals={completedGoals}
          avgProgress={avgProgress}
          connectedPeople={connectedPeople}
        />

        {/* AI Insights Panel */}
        <GoalInsights />

        {/* Filters and Controls */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
          <GoalFilters 
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </Card>

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

        {/* Floating Action Button for Mobile */}
        <div className="fixed bottom-6 right-6 lg:hidden">
          <Button 
            icon={Plus} 
            onClick={() => setIsModalOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25"
          />
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
          <GoalForm
            onSubmit={handleSubmit}
            editingGoal={editingGoal}
            loading={createMutation.isPending || updateMutation.isPending}
            onCancel={() => {
              setIsModalOpen(false);
              setEditingGoal(null);
            }}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Goals;