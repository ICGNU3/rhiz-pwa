import React, { useContext, useEffect, useState } from 'react';
import Button from '../ui/Button';
import { useContextualSuggestions } from '../../hooks/useContextualSuggestions';

interface Goal {
  id: string;
  title: string;
  description: string;
  target_date: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category?: string;
}

interface GoalFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  editingGoal?: Goal | null;
  loading?: boolean;
  onCancel: () => void;
}

export default function GoalForm({ onSubmit, editingGoal, loading = false, onCancel }: GoalFormProps) {
  const { suggestions, smartDefaults } = useContextualSuggestions('goals');
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Define FormState type
  interface FormState {
    title: string;
    description: string;
    target_date: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    category?: string;
  }

  const [form, setForm] = useState<FormState>(() => ({
    title: '',
    description: '',
    target_date: '',
    completed: false,
    priority: 'medium',
    category: '',
  }));

  // On mount, if category/priority are empty and smartDefaults exist, pre-fill
  useEffect(() => {
    if (!form.category && smartDefaults.category) {
      setForm(f => ({ ...f, category: smartDefaults.category }));
    }
    if (!form.priority && smartDefaults.priority) {
      setForm(f => ({ ...f, priority: smartDefaults.priority as 'low' | 'medium' | 'high' }));
    }
    // eslint-disable-next-line
  }, []);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
              name="target_date"
              type="date"
              required
              defaultValue={editingGoal?.target_date}
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
          onClick={onCancel}
          className="px-6"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          className="px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          {editingGoal ? 'Update Goal' : 'Create Goal'}
        </Button>
      </div>

      {/* Contextual Suggestions Panel */}
      {showSuggestions && suggestions && suggestions.length > 0 && (
        <div className="mb-4 p-3 rounded bg-gradient-to-r from-green-50 to-blue-50 border border-blue-200 shadow flex flex-col gap-2 relative">
          <button className="absolute top-2 right-2 text-xs text-blue-500" onClick={() => setShowSuggestions(false)} aria-label="Dismiss suggestions">&times;</button>
          <div className="font-semibold text-blue-900 mb-1">Suggestions for you</div>
          {suggestions.map((s, i) => (
            <div key={i} className="text-sm text-blue-800">{s}</div>
          ))}
        </div>
      )}
    </form>
  );
}