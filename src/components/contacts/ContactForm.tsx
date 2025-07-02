import React from 'react';
import Button from '../ui/Button';

interface ContactFormProps { 
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading?: boolean;
}

export default function ContactForm({ onSubmit, loading = false }: ContactFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Full Name *
          </label>
          <input
            name="name"
            type="text"
            required
            className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Email Address *
          </label>
          <input
            name="email"
            type="email"
            required
            className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Phone Number
          </label>
          <input
            name="phone"
            type="tel"
            className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Company *
          </label>
          <input
            name="company"
            type="text"
            required
            className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            placeholder="Acme Corp"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Job Title *
          </label>
          <input
            name="title"
            type="text"
            required
            className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            placeholder="Software Engineer"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Location
          </label>
          <input
            name="location"
            type="text"
            className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            placeholder="San Francisco, CA"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Tags & Keywords
        </label>
        <input
          name="tags"
          type="text"
          className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          placeholder="tech, startup, investor, ai (separate with commas)"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Add relevant tags to help categorize and find this contact later
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Notes & Context
        </label>
        <textarea
          name="notes"
          rows={4}
          className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          placeholder="How you met, shared interests, mutual connections, goals..."
        />
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          className="px-6"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          className="px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          Add Contact
        </Button>
      </div>
    </form>
  );
}