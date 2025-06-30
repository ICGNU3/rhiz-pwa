import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const AnimatedNetworkGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Generate random nodes and edges for the demo
  const nodes = Array.from({ length: 15 }, (_, i) => ({
    id: `node-${i}`,
    x: Math.random() * 300 + 50,
    y: Math.random() * 200 + 50,
    size: Math.random() * 8 + 4,
    color: i % 3 === 0 ? '#2ECC71' : i % 3 === 1 ? '#1ABC9C' : '#8E44AD'
  }));
  
  const edges = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (Math.random() > 0.7) {
        edges.push({
          id: `edge-${i}-${j}`,
          source: i,
          target: j,
          strength: Math.random() * 0.5 + 0.1
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
        {/* Background Grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-200 dark:text-gray-700" opacity="0.3"/>
          </pattern>
          
          {/* Glow effects */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Animated Edges */}
        <motion.g 
          className="edges"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
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
              opacity={0.6}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.8 + Math.random() * 0.5 }}
            />
          ))}
        </motion.g>

        {/* Animated Nodes */}
        <g className="nodes">
          {nodes.map((node, index) => (
            <motion.g 
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.1 * index,
                type: "spring",
                stiffness: 200,
                damping: 10
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
                  x: [0, Math.random() * 20 - 10, 0],
                  y: [0, Math.random() * 20 - 10, 0],
                }}
                transition={{
                  duration: 5 + Math.random() * 3,
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
};

export default AnimatedNetworkGraph;