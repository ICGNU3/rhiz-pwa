import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Network, Users, Zap, Search, Filter, Maximize2, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../Button';

interface NetworkNode {
  id: string;
  name: string;
  company: string;
  title: string;
  trustScore: number;
  relationshipStrength: 'strong' | 'medium' | 'weak';
  category: string;
  x?: number;
  y?: number;
}

interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  strength: number;
  type: 'direct' | 'mutual' | 'introduction';
}

interface NetworkGraphProps {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  onNodeClick?: (node: NetworkNode) => void;
  selectedNode?: NetworkNode | null;
  viewMode?: 'force' | 'cluster' | 'hierarchy';
  minStrength?: number;
}

export default function NetworkGraph({ 
  nodes, 
  edges, 
  onNodeClick, 
  selectedNode,
  viewMode = 'force',
  minStrength = 0
}: NetworkGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [nodePositions, setNodePositions] = useState<Map<string, {x: number, y: number, vx: number, vy: number}>>(new Map());
  const [simulationRunning, setSimulationRunning] = useState(true);
  const animationFrameRef = useRef<number | null>(null);

  // Function to toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    // Listen for fullscreen change
    document.addEventListener('fullscreenchange', () => {
      setIsFullscreen(!!document.fullscreenElement);
      updateDimensions();
    });

    return () => {
      window.removeEventListener('resize', updateDimensions);
      document.removeEventListener('fullscreenchange', () => {});
    };
  }, []);

  // Initialize node positions
  useEffect(() => {
    if (nodes.length === 0) return;

    const newPositions = new Map<string, {x: number, y: number, vx: number, vy: number}>();
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    
    nodes.forEach((node) => {
      // If we already have a position for this node, keep it
      if (nodePositions.has(node.id)) {
        newPositions.set(node.id, nodePositions.get(node.id)!);
        return;
      }
      
      // Otherwise, initialize with a position based on the view mode
      let x = 0, y = 0;
      
      switch (viewMode) {
        case 'force':
          // Random position in a circle around the center
          const angle = Math.random() * 2 * Math.PI;
          const radius = 100 + Math.random() * 150;
          x = centerX + Math.cos(angle) * radius;
          y = centerY + Math.sin(angle) * radius;
          break;
          
        case 'cluster':
          // Group by category
          const categories = [...new Set(nodes.map(n => n.category))];
          const categoryIndex = categories.indexOf(node.category);
          const clusterAngle = (categoryIndex / categories.length) * 2 * Math.PI;
          const clusterRadius = Math.min(dimensions.width, dimensions.height) * 0.3;
          const clusterCenterX = centerX + Math.cos(clusterAngle) * clusterRadius;
          const clusterCenterY = centerY + Math.sin(clusterAngle) * clusterRadius;
          
          const nodeAngle = Math.random() * 2 * Math.PI;
          const nodeRadius = 50 + Math.random() * 30;
          x = clusterCenterX + Math.cos(nodeAngle) * nodeRadius;
          y = clusterCenterY + Math.sin(nodeAngle) * nodeRadius;
          break;
          
        case 'hierarchy':
          // Arrange by trust score (hierarchy)
          const trustLevel = Math.floor(node.trustScore / 20); // 0-4 based on trust score
          const levelSpacing = dimensions.height / 6;
          const nodesPerRow = Math.ceil(nodes.length / 5);
          const horizontalSpacing = dimensions.width / (nodesPerRow + 1);
          
          const nodeIndex = nodes.findIndex(n => n.id === node.id);
          const positionInLevel = nodeIndex % nodesPerRow;
          
          x = horizontalSpacing * (positionInLevel + 1);
          y = levelSpacing * (5 - trustLevel);
          break;
      }
      
      newPositions.set(node.id, {
        x, 
        y, 
        vx: Math.random() * 2 - 1, 
        vy: Math.random() * 2 - 1
      });
    });
    
    setNodePositions(newPositions);
  }, [nodes, viewMode, dimensions]);

  // Force simulation
  const runSimulation = useCallback(() => {
    if (!simulationRunning || nodes.length === 0) return;
    
    const newPositions = new Map(nodePositions);
    
    // Apply forces
    nodes.forEach(node => {
      if (!newPositions.has(node.id)) return;
      
      const pos = newPositions.get(node.id)!;
      let fx = 0, fy = 0;
      
      // Center gravity force
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      const dx = centerX - pos.x;
      const dy = centerY - pos.y;
      const distanceToCenter = Math.sqrt(dx * dx + dy * dy);
      
      // Stronger gravity for nodes far from center
      const gravityStrength = 0.01 * Math.max(1, distanceToCenter / 200);
      fx += dx * gravityStrength;
      fy += dy * gravityStrength;
      
      // Node repulsion force
      nodes.forEach(otherNode => {
        if (node.id === otherNode.id || !newPositions.has(otherNode.id)) return;
        
        const otherPos = newPositions.get(otherNode.id)!;
        const dx = pos.x - otherPos.x;
        const dy = pos.y - otherPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance === 0) return;
        
        // Repulsion strength based on node trust scores
        const repulsionStrength = 500 / (distance * distance);
        const repulsionFactor = Math.min(repulsionStrength, 10); // Limit max force
        
        fx += (dx / distance) * repulsionFactor;
        fy += (dy / distance) * repulsionFactor;
      });
      
      // Edge attraction force
      edges.forEach(edge => {
        if (edge.source === node.id && newPositions.has(edge.target)) {
          const targetPos = newPositions.get(edge.target)!;
          const dx = targetPos.x - pos.x;
          const dy = targetPos.y - pos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance === 0) return;
          
          // Attraction strength based on edge strength
          const attractionStrength = 0.05 * edge.strength;
          
          fx += dx * attractionStrength;
          fy += dy * attractionStrength;
        }
        else if (edge.target === node.id && newPositions.has(edge.source)) {
          const sourcePos = newPositions.get(edge.source)!;
          const dx = sourcePos.x - pos.x;
          const dy = sourcePos.y - pos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance === 0) return;
          
          // Attraction strength based on edge strength
          const attractionStrength = 0.05 * edge.strength;
          
          fx += dx * attractionStrength;
          fy += dy * attractionStrength;
        }
      });
      
      // Update velocity with forces
      pos.vx = pos.vx * 0.9 + fx * 0.1;
      pos.vy = pos.vy * 0.9 + fy * 0.1;
      
      // Apply velocity with damping
      pos.x += pos.vx * 0.5;
      pos.y += pos.vy * 0.5;
      
      // Boundary constraints
      const padding = 50;
      const nodeSize = 20;
      
      if (pos.x < padding) {
        pos.x = padding;
        pos.vx = Math.abs(pos.vx) * 0.5;
      }
      if (pos.x > dimensions.width - padding) {
        pos.x = dimensions.width - padding;
        pos.vx = -Math.abs(pos.vx) * 0.5;
      }
      if (pos.y < padding) {
        pos.y = padding;
        pos.vy = Math.abs(pos.vy) * 0.5;
      }
      if (pos.y > dimensions.height - padding) {
        pos.y = dimensions.height - padding;
        pos.vy = -Math.abs(pos.vy) * 0.5;
      }
      
      newPositions.set(node.id, pos);
    });
    
    setNodePositions(newPositions);
    
    // Continue animation
    animationFrameRef.current = requestAnimationFrame(runSimulation);
  }, [nodes, edges, nodePositions, dimensions, simulationRunning]);

  // Start/stop simulation
  useEffect(() => {
    if (simulationRunning) {
      animationFrameRef.current = requestAnimationFrame(runSimulation);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [runSimulation, simulationRunning]);

  // Stop simulation after a while to save resources
  useEffect(() => {
    if (viewMode === 'force') {
      setSimulationRunning(true);
      const timer = setTimeout(() => {
        setSimulationRunning(false);
      }, 10000); // Run for 10 seconds
      
      return () => clearTimeout(timer);
    } else {
      setSimulationRunning(false);
    }
  }, [viewMode, nodes]);

  const getNodeColor = (node: NetworkNode) => {
    if (selectedNode?.id === node.id) return '#6366F1';
    if (hoveredNode === node.id) return '#8B5CF6';
    
    switch (node.relationshipStrength) {
      case 'strong': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'weak': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getNodeSize = (node: NetworkNode) => {
    const baseSize = 8;
    const trustMultiplier = node.trustScore / 100;
    return baseSize + (trustMultiplier * 12);
  };

  const getEdgeColor = (edge: NetworkEdge) => {
    switch (edge.type) {
      case 'direct': return '#6366F1';
      case 'mutual': return '#10B981';
      case 'introduction': return '#F59E0B';
      default: return '#D1D5DB';
    }
  };

  const filteredNodes = filterCategory === 'all' 
    ? nodes.filter(node => node.trustScore >= minStrength)
    : nodes.filter(node => node.category === filterCategory && node.trustScore >= minStrength);

  const filteredEdges = edges.filter(edge => 
    filteredNodes.some(node => node.id === edge.source) &&
    filteredNodes.some(node => node.id === edge.target)
  );

  const categories = [...new Set(nodes.map(node => node.category))];

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-900 rounded-xl overflow-hidden"
    >
      {/* Controls */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-1 shadow-sm">
              {['force', 'cluster', 'hierarchy'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    if (viewMode !== mode) {
                      setSimulationRunning(mode === 'force');
                    }
                  }}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                    viewMode === mode 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLabels(!showLabels)}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
            >
              {showLabels ? 'Hide Labels' : 'Show Labels'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={Maximize2}
              onClick={toggleFullscreen}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
            >
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={Settings}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
            >
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Network Visualization */}
      <div className="w-full h-full relative">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className="w-full h-full"
        >
          {/* Background Grid */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-200 dark:text-gray-700" opacity="0.3"/>
            </pattern>
            
            {/* Glow effects */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Gradient for edges */}
            <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8"/>
            </linearGradient>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Edges with Animation */}
          <g className="edges">
            <AnimatePresence>
              {filteredEdges.map((edge) => {
                const sourceNode = filteredNodes.find(n => n.id === edge.source);
                const targetNode = filteredNodes.find(n => n.id === edge.target);
                
                if (!sourceNode || !targetNode) return null;
                
                const sourcePos = nodePositions.get(sourceNode.id);
                const targetPos = nodePositions.get(targetNode.id);
                
                if (!sourcePos || !targetPos) return null;

                return (
                  <motion.line
                    key={edge.id}
                    x1={sourcePos.x}
                    y1={sourcePos.y}
                    x2={targetPos.x}
                    y2={targetPos.y}
                    stroke={getEdgeColor(edge)}
                    strokeWidth={edge.strength * 3}
                    opacity={0.6}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ 
                      pathLength: 1, 
                      opacity: 0.6,
                      x1: sourcePos.x,
                      y1: sourcePos.y,
                      x2: targetPos.x,
                      y2: targetPos.y
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      pathLength: { duration: 0.8, ease: "easeInOut" },
                      opacity: { duration: 0.3 },
                      default: { duration: 0.3 }
                    }}
                    className={`${
                      (hoveredNode === edge.source || hoveredNode === edge.target || 
                       selectedNode?.id === edge.source || selectedNode?.id === edge.target)
                        ? 'stroke-[5px] opacity-80'
                        : ''
                    }`}
                  />
                );
              })}
            </AnimatePresence>
          </g>

          {/* Nodes with Animation */}
          <g className="nodes">
            <AnimatePresence>
              {filteredNodes.map((node) => {
                const position = nodePositions.get(node.id);
                if (!position) return null;
                
                const nodeSize = getNodeSize(node);
                const isSelected = selectedNode?.id === node.id;
                const isHovered = hoveredNode === node.id;
                
                return (
                  <motion.g 
                    key={node.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1,
                      x: position.x,
                      y: position.y
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ 
                      scale: { duration: 0.5, type: "spring" },
                      opacity: { duration: 0.3 },
                      x: { duration: 0.3, ease: "easeOut" },
                      y: { duration: 0.3, ease: "easeOut" }
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Node glow effect */}
                    {(isSelected || isHovered) && (
                      <motion.circle
                        cx={0}
                        cy={0}
                        r={nodeSize + 8}
                        fill={getNodeColor(node)}
                        opacity={0.3}
                        filter="url(#glow)"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    
                    {/* Main node */}
                    <motion.circle
                      cx={0}
                      cy={0}
                      r={nodeSize}
                      fill={getNodeColor(node)}
                      stroke="white"
                      strokeWidth={isSelected ? 3 : 2}
                      className="cursor-pointer transition-all duration-300 hover:stroke-indigo-400"
                      onClick={() => onNodeClick?.(node)}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      animate={{
                        r: isSelected || isHovered ? nodeSize * 1.1 : nodeSize
                      }}
                      transition={{ duration: 0.2 }}
                    />
                    
                    {/* Trust score indicator */}
                    <motion.circle
                      cx={nodeSize - 3}
                      cy={-nodeSize + 3}
                      r={4}
                      fill={node.trustScore >= 80 ? '#10B981' : node.trustScore >= 60 ? '#F59E0B' : '#EF4444'}
                      stroke="white"
                      strokeWidth={1}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    />
                    
                    {/* Node labels */}
                    <AnimatePresence>
                      {showLabels && (isHovered || isSelected || nodeSize > 12) && (
                        <motion.g
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <rect
                            x={-40}
                            y={nodeSize + 5}
                            width={80}
                            height={32}
                            fill="white"
                            stroke="gray"
                            strokeWidth={1}
                            rx={4}
                            opacity={0.95}
                          />
                          <text
                            x={0}
                            y={nodeSize + 18}
                            textAnchor="middle"
                            className="text-xs font-medium fill-gray-900"
                          >
                            {node.name}
                          </text>
                          <text
                            x={0}
                            y={nodeSize + 30}
                            textAnchor="middle"
                            className="text-xs fill-gray-600"
                          >
                            {node.company}
                          </text>
                        </motion.g>
                      )}
                    </AnimatePresence>
                  </motion.g>
                );
              })}
            </AnimatePresence>
          </g>
        </svg>

        {/* Loading State */}
        <AnimatePresence>
          {filteredNodes.length === 0 && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Network className="w-8 h-8 text-white animate-pulse" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Building Your Network Graph
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Analyzing relationships and calculating trust scores...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <motion.div 
        className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Strong Relationship</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Medium Relationship</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Weak Relationship</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Direct Connection</span>
          </div>
        </div>
      </motion.div>

      {/* Network Stats */}
      <motion.div 
        className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {filteredNodes.length}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Nodes Visible
          </div>
        </div>
      </motion.div>

      {/* Simulation Controls */}
      {viewMode === 'force' && (
        <motion.div 
          className="absolute top-16 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-2 shadow-sm"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSimulationRunning(!simulationRunning)}
            className="text-xs"
          >
            {simulationRunning ? 'Pause Simulation' : 'Resume Simulation'}
          </Button>
        </motion.div>
      )}
    </div>
  );
}