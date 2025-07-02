import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Moon,
  Sun,
  Download,
  MessageSquare
} from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface SidebarContentProps {
  navigation: Array<{
    name: string;
    href: string;
    icon: React.FC<{ className?: string }>;
    description: string;
  }>;
  location: { pathname: string };  toggleSidebar: () => void;
  theme: string;
  toggleTheme: () => void;  user: User | null;
  logout: () => void;
  handleInstall: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  navigation,
  location,
  toggleSidebar,
  theme,
  toggleTheme,
  user,
  logout,
  handleInstall
}) => {
  return (
    <div className="flex flex-col h-full">
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-3 py-3 text-sm font-light rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-aqua to-emerald text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
              onClick={toggleSidebar}            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`} />
              <div className="flex-1">                <div className={`font-light ${isActive ? 'text-white' : ''}`}>{item.name}</div>
                <div className={`text-xs font-light ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                  {item.description}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="flex-shrink-0">
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
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
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
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-light text-gray-900 dark:text-white truncate">
                {user?.email || 'User'}
              </p>
              <button
                onClick={logout}
                className="text-xs font-light text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Sign out
              </button>
            </div>
          </div>        </div>
      </div>
    </div>
  );
};

export default SidebarContent;