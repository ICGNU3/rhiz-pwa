import React, { useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';

// Memoize the component to prevent unnecessary re-renders
const AnimatedNetworkGraph: React.FC = memo(() => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Generate random nodes and edges for the demo - optimized to reduce calculations
  const nodes = Array.from({ length: 12 }, (_, i) => ({
    id: `node-${i}`,
    x: Math.random() * 300 + 50,
    y: Math.random() * 200 + 50,
    size: Math.random() * 6 + 4,
    color: i % 3 === 0 ? '#2ECC71' : i % 3 === 1 ? '#1ABC9C' : '#8E44AD'
  }));
  
  // Reduce number of edges for better performance
  const edges = [];
  for (let i = 0; i < nodes.length; i++) {
    // Connect to at most 2 other nodes
    const connections = Math.floor(Math.random() * 2) + 1;
    for (let c = 0; c < connections; c++) {
      const j = (i + c + 1) % nodes.length;
      edges.push({
        id: `edge-${i}-${j}`,
        source: i,
        target: j,
        strength: Math.random() * 0.3 + 0.1
      });
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
          
          {/* Simplified glow effect */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Animated Edges - with reduced animation complexity */}
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
              stroke={Math.random() > 0.5 ? "#1ABC9C" : "#8E44AD"}
              strokeWidth={edge.strength * 2}
              opacity={0.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          ))}
        </motion.g>

        {/* Animated Nodes - with simplified animations */}
        <g className="nodes">
          {nodes.map((node, index) => (
            <motion.g 
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.4, 
                delay: 0.05 * index,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
            >
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.size}
                fill={node.color}
                stroke="white"
                strokeWidth={1.5}
                filter="url(#glow)"
                animate={{
                  x: [0, Math.random() * 10 - 5, 0],
                  y: [0, Math.random() * 10 - 5, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.g>
          ))}
        </g>
      </svg>
    </div>
  );
});

AnimatedNetworkGraph.displayName = 'AnimatedNetworkGraph';

export default AnimatedNetworkGraph;