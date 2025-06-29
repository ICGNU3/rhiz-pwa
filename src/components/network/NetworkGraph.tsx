import React, { useState, useEffect } from 'react';
import { Network, Users, Zap, Search, Filter, Maximize2, Settings } from 'lucide-react';
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
}

export default function NetworkGraph({ nodes, edges, onNodeClick, selectedNode }: NetworkGraphProps) {
  const [viewMode, setViewMode] = useState<'force' | 'cluster' | 'hierarchy'>('force');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showLabels, setShowLabels] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Simulate network layout positions
  useEffect(() => {
    // In a real implementation, this would use a force-directed layout algorithm
    // For now, we'll create a simple circular layout
    const centerX = 400;
    const centerY = 300;
    const radius = 200;
    
    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI;
      node.x = centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 100;
      node.y = centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 100;
    });
  }, [nodes, viewMode]);

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
    ? nodes 
    : nodes.filter(node => node.category === filterCategory);

  const categories = [...new Set(nodes.map(node => node.category))];

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-900 rounded-xl overflow-hidden">
      {/* Controls */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-1 shadow-sm">
              {['force', 'cluster', 'hierarchy'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as any)}
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
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
            >
              Fullscreen
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
          width="100%"
          height="100%"
          viewBox="0 0 800 600"
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
          </defs>
          
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Edges */}
          <g className="edges">
            {edges.map((edge) => {
              const sourceNode = nodes.find(n => n.id === edge.source);
              const targetNode = nodes.find(n => n.id === edge.target);
              
              if (!sourceNode || !targetNode || !sourceNode.x || !sourceNode.y || !targetNode.x || !targetNode.y) {
                return null;
              }

              return (
                <line
                  key={edge.id}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={getEdgeColor(edge)}
                  strokeWidth={edge.strength * 3}
                  opacity={0.6}
                  className="transition-all duration-300"
                />
              );
            })}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {filteredNodes.map((node) => {
              if (!node.x || !node.y) return null;
              
              const nodeSize = getNodeSize(node);
              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNode === node.id;
              
              return (
                <g key={node.id}>
                  {/* Node glow effect */}
                  {(isSelected || isHovered) && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={nodeSize + 8}
                      fill={getNodeColor(node)}
                      opacity={0.3}
                      filter="url(#glow)"
                    />
                  )}
                  
                  {/* Main node */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={nodeSize}
                    fill={getNodeColor(node)}
                    stroke="white"
                    strokeWidth={isSelected ? 3 : 2}
                    className="cursor-pointer transition-all duration-300 hover:stroke-indigo-400"
                    onClick={() => onNodeClick?.(node)}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  />
                  
                  {/* Trust score indicator */}
                  <circle
                    cx={node.x + nodeSize - 3}
                    cy={node.y - nodeSize + 3}
                    r={4}
                    fill={node.trustScore >= 80 ? '#10B981' : node.trustScore >= 60 ? '#F59E0B' : '#EF4444'}
                    stroke="white"
                    strokeWidth={1}
                  />
                  
                  {/* Node labels */}
                  {showLabels && (isHovered || isSelected || nodeSize > 12) && (
                    <g>
                      <rect
                        x={node.x - 40}
                        y={node.y + nodeSize + 5}
                        width={80}
                        height={32}
                        fill="white"
                        stroke="gray"
                        strokeWidth={1}
                        rx={4}
                        opacity={0.95}
                      />
                      <text
                        x={node.x}
                        y={node.y + nodeSize + 18}
                        textAnchor="middle"
                        className="text-xs font-medium fill-gray-900"
                      >
                        {node.name}
                      </text>
                      <text
                        x={node.x}
                        y={node.y + nodeSize + 30}
                        textAnchor="middle"
                        className="text-xs fill-gray-600"
                      >
                        {node.company}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Loading State */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
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
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-sm">
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
      </div>

      {/* Network Stats */}
      <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-sm">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {filteredNodes.length}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Nodes Visible
          </div>
        </div>
      </div>
    </div>
  );
}