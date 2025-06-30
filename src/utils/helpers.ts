// Utility helper functions
import { TRUST_SCORE_RANGES, RELATIONSHIP_TYPES } from './constants';
import type { Contact, Goal } from '../types';

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getTrustScoreColor = (score: number): string => {
  if (score >= TRUST_SCORE_RANGES.HIGH.min) return `text-${TRUST_SCORE_RANGES.HIGH.color}-600`;
  if (score >= TRUST_SCORE_RANGES.MEDIUM.min) return `text-${TRUST_SCORE_RANGES.MEDIUM.color}-600`;
  return `text-${TRUST_SCORE_RANGES.LOW.color}-600`;
};

export const getTrustScoreBgColor = (score: number): string => {
  if (score >= TRUST_SCORE_RANGES.HIGH.min) return `bg-${TRUST_SCORE_RANGES.HIGH.color}-100 dark:bg-${TRUST_SCORE_RANGES.HIGH.color}-900/20`;
  if (score >= TRUST_SCORE_RANGES.MEDIUM.min) return `bg-${TRUST_SCORE_RANGES.MEDIUM.color}-100 dark:bg-${TRUST_SCORE_RANGES.MEDIUM.color}-900/20`;
  return `bg-${TRUST_SCORE_RANGES.LOW.color}-100 dark:bg-${TRUST_SCORE_RANGES.LOW.color}-900/20`;
};

export const getRelationshipColor = (strength: string): string => {
  switch (strength) {
    case 'strong': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200';
    case 'weak': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200';
  }
};

export const getRelationshipTypeColor = (type: string): string => {
  const colors = {
    friend: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    colleague: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    investor: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    mentor: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    client: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
    partner: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'
  };
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200';
    case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200';
    case 'low': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200';
  }
};

export const getProgressColor = (progress: number): string => {
  if (progress >= 80) return 'from-green-500 to-emerald-600';
  if (progress >= 60) return 'from-blue-500 to-indigo-600';
  if (progress >= 40) return 'from-yellow-500 to-orange-600';
  return 'from-red-500 to-pink-600';
};

export const calculateDaysUntilDue = (targetDate: string): number => {
  return Math.ceil((new Date(targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
};

export const isOverdue = (targetDate: string, completed: boolean): boolean => {
  return !completed && new Date(targetDate) < new Date();
};

export const filterContacts = (
  contacts: Contact[],
  searchTerm: string,
  relationshipFilter: string
): Contact[] => {
  return contacts.filter((contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (relationshipFilter === 'all') return matchesSearch;
    return matchesSearch && contact.relationship_type === relationshipFilter;
  });
};

export const sortContacts = (contacts: Contact[], sortBy: string): Contact[] => {
  return [...contacts].sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.name.localeCompare(b.name);
      case 'company': return a.company.localeCompare(b.company);
      case 'trustScore': return (b.trust_score || 0) - (a.trust_score || 0);
      case 'lastContact': 
        if (!a.last_contact && !b.last_contact) return 0;
        if (!a.last_contact) return 1;
        if (!b.last_contact) return -1;
        return new Date(b.last_contact).getTime() - new Date(a.last_contact).getTime();
      default: return 0;
    }
  });
};

export const filterGoals = (goals: Goal[], filterBy: string): Goal[] => {
  return goals.filter((goal) => {
    if (filterBy === 'all') return true;
    if (filterBy === 'active') return !goal.completed;
    if (filterBy === 'completed') return goal.completed;
    if (filterBy === 'overdue') return isOverdue(goal.target_date, goal.completed);
    if (filterBy === 'high-priority') return goal.priority === 'high';
    return true;
  });
};

export const sortGoals = (goals: Goal[], sortBy: string): Goal[] => {
  return [...goals].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === 'progress') {
      return (b.progress || 0) - (a.progress || 0);
    }
    if (sortBy === 'deadline') {
      return new Date(a.target_date).getTime() - new Date(b.target_date).getTime();
    }
    return 0;
  });
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};