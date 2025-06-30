import React from 'react';
import { motion } from 'framer-motion';
import { Users, Star, TrendingUp, MessageSquare } from 'lucide-react';

const AnimatedContactStats: React.FC = () => {
  const stats = [
    {
      title: 'Total Contacts',
      value: 247,
      icon: Users,
      color: 'text-aqua',
      bgColor: 'bg-aqua/10'
    },
    {
      title: 'Strong Relationships',
      value: 86,
      icon: Star,
      color: 'text-emerald',
      bgColor: 'bg-emerald/10'
    },
    {
      title: 'Avg Trust Score',
      value: 82,
      icon: TrendingUp,
      color: 'text-lavender',
      bgColor: 'bg-lavender/10'
    },
    {
      title: 'Growing Engagement',
      value: 35,
      icon: MessageSquare,
      color: 'text-aqua',
      bgColor: 'bg-aqua/10'
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="w-full h-full p-4 bg-white dark:bg-gray-800 overflow-hidden">
      <motion.div 
        className="grid grid-cols-2 gap-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={index} 
              className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              variants={item}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center space-x-2">
                <div className={`p-1.5 rounded-md ${stat.bgColor}`}>
                  <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-light text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs font-light text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        className="mt-4 space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.div 
          className="flex items-center space-x-3 p-3 bg-gradient-to-r from-aqua/10 to-emerald/10 rounded-lg"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-aqua to-emerald rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-light">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-light text-gray-900 dark:text-white truncate">
              John Doe
            </h3>
            <p className="text-xs font-light text-gray-600 dark:text-gray-400 truncate">
              CEO at TechCorp
            </p>
          </div>
          <div className="px-2 py-1 bg-emerald/10 rounded-full">
            <span className="text-xs font-light text-emerald">92</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-r from-aqua/10 to-emerald/10 rounded-b-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <div className="flex items-center justify-center space-x-1">
          <TrendingUp className="w-3 h-3 text-emerald" />
          <p className="text-xs text-gray-700 dark:text-gray-300 font-light">
            Contact intelligence dashboard
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AnimatedContactStats;