import React, { useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';

// Memoize the component to prevent unnecessary re-renders
const AnimatedNetworkGraph: React.FC = memo(() => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Generate random nodes and edges for the demo
  const nodes = Array.from({ length: 15 }, (_, i) => ({
    id: `node-${i}`,
    x: Math.random() * 300 + 50,
    y: Math.random() * 200 + 50,
    size: Math.random() * 6 + 4,
    color: i % 3 === 0 ? '#2ECC71' : i % 3 === 1 ? '#1ABC9C' : '#8E44AD'
  }));
  
  // Create more interesting connections
  const edges = [];
  for (let i = 0; i < nodes.length; i++) {
    // Connect to 2-3 other nodes
    const connections = Math.floor(Math.random() * 2) + 2;
    for (let c = 0; c < connections; c++) {
      // Create more natural connections (not just sequential)
      const j = (i + Math.floor(Math.random() * nodes.length)) % nodes.length;
      if (i !== j) {
        edges.push({
          id: `edge-${i}-${j}`,
          source: i,
          target: j,
          strength: Math.random() * 0.3 + 0.1
        });
      }
    }
  }

  return (
    <div className="w-full h-full relative overflow-hidden">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 400 300"
        className="w-full h-full"
      >
        {/* Background Grid - simplified */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-200 dark:text-gray-700" opacity="0.3"/>
          </pattern>
          
          {/* Enhanced glow effect */}
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Gradient for edges */}
          <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1ABC9C" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#8E44AD" stopOpacity="0.6"/>
          </linearGradient>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Animated Edges with enhanced styling */}
        <motion.g 
          className="edges"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {edges.map((edge) => (
            <motion.line
              key={edge.id}
              x1={nodes[edge.source].x}
              y1={nodes[edge.source].y}
              x2={nodes[edge.target].x}
              y2={nodes[edge.target].y}
              stroke="url(#edgeGradient)"
              strokeWidth={edge.strength * 3}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ 
                duration: 1.5, 
                delay: 0.5 + Math.random() * 0.5,
                ease: "easeInOut"
              }}
            >
              <animate
                attributeName="strokeDashoffset"
                from="0"
                to="20"
                dur="3s"
                repeatCount="indefinite"
              />
            </motion.line>
          ))}
        </motion.g>

        {/* Animated Nodes with enhanced animations */}
        <g className="nodes">
          {nodes.map((node, index) => (
            <motion.g 
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.05 * index,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
            >
              {/* Glow effect */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.size + 4}
                fill={node.color}
                opacity={0.3}
                filter="url(#glow)"
                animate={{
                  r: [node.size + 4, node.size + 8, node.size + 4],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Main node */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.size}
                fill={node.color}
                stroke="white"
                strokeWidth={1.5}
                filter="url(#glow)"
                animate={{
                  x: [0, Math.random() * 15 - 7.5, 0],
                  y: [0, Math.random() * 15 - 7.5, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Pulse effect for some nodes */}
              {index % 3 === 0 && (
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={node.size}
                  fill="transparent"
                  stroke={node.color}
                  strokeWidth={1}
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ 
                    scale: [1, 2, 1],
                    opacity: [0.8, 0, 0.8]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              )}
            </motion.g>
          ))}
        </g>
        
        {/* Floating particles for added dynamism */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.circle
            key={`particle-${i}`}
            cx={Math.random() * 400}
            cy={Math.random() * 300}
            r={1 + Math.random() * 2}
            fill="#ffffff"
            opacity={0.6}
            animate={{
              x: [0, Math.random() * 50 - 25, 0],
              y: [0, Math.random() * 50 - 25, 0],
              opacity: [0.2, 0.7, 0.2]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </svg>
    </div>
  );
});

AnimatedNetworkGraph.displayName = 'AnimatedNetworkGraph';

export default AnimatedNetworkGraph;