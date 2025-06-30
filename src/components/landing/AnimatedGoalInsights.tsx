import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, Users, Lightbulb } from 'lucide-react';

// Memoize the component to prevent unnecessary re-renders
const AnimatedGoalInsights: React.FC = memo(() => {
  const insights = [
    {
      title: 'Smart Recommendation',
      description: 'Connect with Sarah Chen for your fundraising goal',
      type: 'opportunity',
      icon: Zap,
      color: 'text-emerald',
      bgColor: 'bg-emerald/10'
    },
    {
      title: 'Progress Alert',
      description: 'Your hiring goal is 70% complete',
      type: 'progress',
      icon: Target,
      color: 'text-aqua',
      bgColor: 'bg-aqua/10'
    },
    {
      title: 'Network Opportunity',
      description: '5 mutual connections could help with your partnership goals',
      type: 'network',
      icon: Users,
      color: 'text-lavender',
      bgColor: 'bg-lavender/10'
    }
  ];

  // Simplified animation variants
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
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="w-full h-full p-4 bg-white dark:bg-gray-800 overflow-hidden">
      <motion.div 
        className="flex items-center space-x-2 mb-4"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="p-1.5 bg-gradient-to-r from-aqua to-emerald rounded-md">
          <Lightbulb className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-sm font-light text-gray-900 dark:text-white">
          AI Goal Insights
        </h3>
      </motion.div>

      <motion.div 
        className="space-y-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <motion.div 
              key={index} 
              className={`p-3 rounded-lg ${insight.bgColor} border border-gray-100 dark:border-gray-700`}
              variants={item}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-1.5 rounded-md ${insight.bgColor}`}>
                  <Icon className={`w-3.5 h-3.5 ${insight.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium text-gray-900 dark:text-white truncate">
                    {insight.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {insight.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
});

AnimatedGoalInsights.displayName = 'AnimatedGoalInsights';

export default AnimatedGoalInsights;