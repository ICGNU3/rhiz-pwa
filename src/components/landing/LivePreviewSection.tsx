import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';

// Lazy load the animated components
const AnimatedNetworkGraph = lazy(() => import('./AnimatedNetworkGraph'));
const AnimatedGoalInsights = lazy(() => import('./AnimatedGoalInsights'));
const AnimatedContactStats = lazy(() => import('./AnimatedContactStats'));

// Placeholder component for lazy-loaded content
const PlaceholderBox = () => (
  <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-pulse">
    <div className="text-gray-400 dark:text-gray-600">Loading...</div>
  </div>
);

const LivePreviewSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2 
          className="text-3xl font-light text-center mb-8 text-gray-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          See Rhiz in Action
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          {/* Network Map Card */}
          <motion.div 
            className="relative w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            whileHover={{ scale: 1.03 }}
          >
            <Suspense fallback={<PlaceholderBox />}>
              <AnimatedNetworkGraph />
            </Suspense>
            <motion.div 
              className="absolute bottom-0 left-0 right-0 bg-white/50 dark:bg-black/50 p-2 rounded-b-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white flex justify-center">
                Network Map
              </span>
            </motion.div>
          </motion.div>

          {/* Goal Insights Card */}
          <motion.div 
            className="relative w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
          >
            <Suspense fallback={<PlaceholderBox />}>
              <AnimatedGoalInsights />
            </Suspense>
            <motion.div 
              className="absolute bottom-0 left-0 right-0 bg-white/50 dark:bg-black/50 p-2 rounded-b-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white flex justify-center">
                Goal Insights
              </span>
            </motion.div>
          </motion.div>

          {/* Contact Dashboard Card */}
          <motion.div 
            className="relative w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            whileHover={{ scale: 1.03 }}
          >
            <Suspense fallback={<PlaceholderBox />}>
              <AnimatedContactStats />
            </Suspense>
            <motion.div 
              className="absolute bottom-0 left-0 right-0 bg-white/50 dark:bg-black/50 p-2 rounded-b-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white flex justify-center">
                Contact Dashboard
              </span>
            </motion.div>
          </motion.div>
        </div>

        <motion.p 
          className="mt-6 text-center text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Interactive previews of network mapping, goal insights, and contact intelligence—see how Rhiz transforms your relationships in real time.
        </motion.p>
      </div>
    </section>
  );
};

export default LivePreviewSection;