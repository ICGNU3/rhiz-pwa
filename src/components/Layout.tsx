import React, { useState, useCallback, lazy, Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  Target, 
  Users, 
  Upload, 
  Brain, 
  Network, 
  Shield, 
  Settings,
  Moon,
  Sun,
  Download,
  MessageSquare
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { deferredPrompt } from '../main';
import usePrefetchRoute from '../hooks/usePrefetchRoute';
import LoadingScreen from './LoadingScreen';

// Lazy load the sidebar content to improve initial load time
const SidebarContent = lazy(() => import('./SidebarContent'));

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();

  // Prefetch the most common routes
  usePrefetchRoute('/app/dashboard');
  usePrefetchRoute('/app/contacts');
  usePrefetchRoute('/app/goals');

  // Memoize the toggle function to prevent unnecessary re-renders
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/app/dashboard', icon: Home, description: 'Network overview & insights' },
    { name: 'Goals', href: '/app/goals', icon: Target, description: 'Define & track objectives' },
    { name: 'Contacts', href: '/app/contacts', icon: Users, description: 'Relationship graph' },
    { name: 'Import', href: '/app/import', icon: Upload, description: 'Sync your data' },
    { name: 'Intelligence', href: '/app/intelligence', icon: Brain, description: 'AI assistant & insights' },
    { name: 'Network', href: '/app/network', icon: Network, description: 'Visualize connections' },
    { name: 'Trust', href: '/app/trust', icon: Shield, description: 'Privacy & security' },
    { name: 'Settings', href: '/app/settings', icon: Settings, description: 'Account preferences' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans font-light">
      {/* Sidebar - with optimized rendering */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 will-change-transform`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <img 
              src="/OuRhizome Dark CRM Background Removed Background Removed.png" 
              alt="Rhiz Logo" 
              className="w-8 h-8"
              width="32"
              height="32"
              loading="eager"
            />
            <div>
              <span className="text-xl font-light text-gray-900 dark:text-white">Rhiz</span>
              <p className="text-xs font-light text-gray-500 dark:text-gray-400">Relationship Engine</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <Suspense fallback={<div className="p-6 text-center">Loading navigation...</div>}>
          <SidebarContent 
            navigation={navigation} 
            location={location} 
            toggleSidebar={toggleSidebar}
            theme={theme}
            toggleTheme={toggleTheme}
            user={user}
            logout={logout}
            handleInstall={handleInstall}
          />
        </Suspense>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 font-light">
          {children}
        </main>
      </div>

      {/* Sidebar overlay - with optimized rendering */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden z-40"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Layout;