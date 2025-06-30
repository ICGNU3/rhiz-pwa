import React, { useState } from 'react';
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

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();

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

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans font-light">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <img 
              src="/OuRhizome Dark CRM Background Removed Background Removed.png" 
              alt="Rhiz Logo" 
              className="w-8 h-8"
            />
            <div>
              <span className="text-xl font-light text-gray-900 dark:text-white">Rhiz</span>
              <p className="text-xs font-light text-gray-500 dark:text-gray-400">Relationship Engine</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-3 text-sm font-light rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-aqua to-emerald text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`} />
                <div className="flex-1">
                  <div className={`font-light ${isActive ? 'text-white' : ''}`}>{item.name}</div>
                  <div className={`text-xs font-light ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* AI Assistant Quick Access */}
        <div className="px-4 mb-4">
          <Link
            to="/app/intelligence"
            className="flex items-center px-3 py-3 text-sm font-light text-white bg-gradient-to-r from-lavender to-emerald rounded-lg hover:shadow-lg transition-all duration-200"
          >
            <MessageSquare className="w-5 h-5 mr-3" />
            <div>
              <div className="font-light">Ask AI Assistant</div>
              <div className="text-xs font-light text-white/80">Get network insights</div>
            </div>
          </Link>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-light text-gray-600 dark:text-gray-400">Theme</span>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
          
          <button
            onClick={handleInstall}
            className="w-full flex items-center justify-center px-3 py-2 text-sm font-light text-aqua bg-aqua/10 rounded-lg hover:bg-aqua/20 transition-colors mb-4"
          >
            <Download className="w-4 h-4 mr-2" />
            Install App
          </button>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-aqua to-emerald rounded-full flex items-center justify-center">
              <span className="text-white font-light text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-light text-gray-900 dark:text-white truncate">
                {user?.name}
              </p>
              <button
                onClick={logout}
                className="text-xs font-light text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
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

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;