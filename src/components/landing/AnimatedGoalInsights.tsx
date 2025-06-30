import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, Users, Lightbulb } from 'lucide-react';

const AnimatedGoalInsights: React.FC = () => {
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
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
        className="flex items-center space-x-2 mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
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

      <motion.div
        className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-r from-aqua/10 to-emerald/10 rounded-b-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <div className="flex items-center justify-center space-x-1">
          <Lightbulb className="w-3 h-3 text-emerald" />
          <p className="text-xs text-gray-700 dark:text-gray-300 font-light">
            AI-powered goal recommendations
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AnimatedGoalInsights;