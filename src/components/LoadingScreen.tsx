import React from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = "Loading..." }) => {
  // Array of loading messages that will cycle
  const loadingMessages = [
    "Mapping your circle…",
    "Enriching your connections…",
    "Syncing your goals…",
    "Building momentum…",
    "Calculating trust scores…",
    "Analyzing relationships…"
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-aqua to-lavender">
      {/* Animated Blob Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-emerald/30 blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 120, 0],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-lavender/30 blur-xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -120, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Logo */}
      <div className="relative z-10 mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <img 
            src="/OuRhizome Dark CRM Background Removed Background Removed.png" 
            alt="Rhiz Logo" 
            className="w-24 h-24 drop-shadow-lg"
          />
        </motion.div>
      </div>

      {/* Cycling Messages */}
      <div className="h-8 relative z-10 mb-8 overflow-hidden">
        {loadingMessages.map((msg, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 flex items-center justify-center text-white text-xl font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              y: [20, 0, 0, -20]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatDelay: loadingMessages.length * 4 - 4,
              delay: index * 4,
              ease: "easeInOut",
              times: [0, 0.1, 0.9, 1]
            }}
          >
            {msg}
          </motion.div>
        ))}
      </div>

      {/* Custom message if provided */}
      {message !== "Loading..." && (
        <motion.div
          className="text-white/90 text-sm font-light mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {message}
        </motion.div>
      )}

      {/* Animated Dots */}
      <div className="flex space-x-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-white rounded-full"
            animate={{
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;