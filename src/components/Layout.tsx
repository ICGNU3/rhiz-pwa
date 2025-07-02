import React, { useState, useCallback, lazy, Suspense } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
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
  MessageSquare,
  DollarSign,
  Sparkles,
  Info,
  HelpCircle,
  Mail
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { deferredPrompt } from '../main';
import usePrefetchRoute from '../hooks/usePrefetchRoute';
import LoadingScreen from './LoadingScreen';
import SearchBar from './SearchBar';
import NotificationCenter from './NotificationCenter';

// Lazy load the sidebar content to improve initial load time
const SidebarContent = lazy(() => import('./SidebarContent'));

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAllNotifications } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

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
    { name: 'Pricing', href: '/pricing', icon: DollarSign, description: 'Plans & pricing' },
    { name: 'Features', href: '/features', icon: Sparkles, description: 'What you get' },
    { name: 'About', href: '/about', icon: Info, description: 'Our story' },
    { name: 'FAQ', href: '/faq', icon: HelpCircle, description: 'Frequently asked questions' },
    { name: 'Contact', href: '/contact', icon: Mail, description: 'Get in touch' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans font-light">
      {/* Desktop Sidebar - hidden on mobile, visible on sm and up */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 sm:translate-x-0 sm:static sm:inset-0 will-change-transform hidden sm:block`}
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
            className="sm:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
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
      <div className="flex-1 flex flex-col overflow-hidden sm:ml-0">
        {/* Top bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sm:block">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={toggleSidebar}
              className="sm:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Search Bar - hidden on mobile to save space */}
            <div className="hidden md:flex flex-1 justify-center px-4">
              <SearchBar />
            </div>
            
            <div className="flex-1 md:hidden" />
            
            {/* Notification Center */}
            <div className="flex items-center space-x-2">
              <NotificationCenter
                notifications={notifications}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                onDelete={deleteNotification}
                onClearAll={clearAllNotifications}
              />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 font-light pb-20 sm:pb-6">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation - visible on mobile, hidden on sm and up */}
        <nav className="fixed bottom-0 inset-x-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 flex justify-around p-3 sm:hidden z-40">
          {navigation.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.href)}
                className={`flex flex-col items-center justify-center ${
                  isActive 
                    ? 'text-aqua' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                aria-label={item.name}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar overlay - with optimized rendering */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity sm:hidden z-40"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Layout;