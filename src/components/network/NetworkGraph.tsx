import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Network, Users, Zap, Search, Filter, Maximize2, Settings, Eye, EyeOff, ZoomIn, ZoomOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../Button';
import { measureTime } from '../../utils/performance';

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

// Configuration constants
const RENDER_LIMIT = 150; // Maximum number of nodes to render at once
const EDGE_LIMIT = 300; // Maximum number of edges to render
const CLUSTER_THRESHOLD = 5; // Minimum nodes to form a cluster
const ANIMATION_DURATION = 0.3; // Animation duration in seconds

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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [showAllNodes, setShowAllNodes] = useState(false);
  const [renderStats, setRenderStats] = useState({ 
    nodeCount: 0, 
    edgeCount: 0, 
    renderTime: 0,
    fps: 0
  });
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [nodePositions, setNodePositions] = useState<Map<string, {x: number, y: number, vx: number, vy: number}>>(new Map());
  const [simulationRunning, setSimulationRunning] = useState(true);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(performance.now());
  const panStartRef = useRef<{x: number, y: number} | null>(null);
  const fpsCounterRef = useRef<number[]>([]);

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

  // Filter nodes based on criteria
  const filteredNodes = useMemo(() => {
    return filterCategory === 'all' 
      ? nodes.filter(node => node.trustScore >= minStrength)
      : nodes.filter(node => node.category === filterCategory && node.trustScore >= minStrength);
  }, [nodes, filterCategory, minStrength]);

  // Create clusters for better performance
  const { clusters, clusterMap, visibleNodes, visibleEdges } = useMemo(() => {
    // Start performance measurement
    return measureTime('Network Graph Clustering', () => {
      // If showing all nodes or few nodes, don't cluster
      if (showAllNodes || filteredNodes.length <= RENDER_LIMIT) {
        // Filter edges to only include those between visible nodes
        const relevantEdges = edges.filter(edge => 
          filteredNodes.some(node => node.id === edge.source) &&
          filteredNodes.some(node => node.id === edge.target)
        ).slice(0, EDGE_LIMIT);
        
        return {
          clusters: [],
          clusterMap: new Map(),
          visibleNodes: filteredNodes,
          visibleEdges: relevantEdges
        };
      }
      
      // Create clusters based on category or company
      const categoryClusters = new Map<string, NetworkNode[]>();
      
      // Group nodes by category or company
      filteredNodes.forEach(node => {
        const key = viewMode === 'cluster' ? node.category : node.company;
        if (!categoryClusters.has(key)) {
          categoryClusters.set(key, []);
        }
        categoryClusters.get(key)!.push(node);
      });
      
      // Create cluster nodes and map original nodes to clusters
      const clusters: NetworkNode[] = [];
      const clusterMap = new Map<string, string>(); // Maps node ID to cluster ID
      const importantNodes: NetworkNode[] = [];
      
      // Add important nodes (high trust, selected, or hovered)
      filteredNodes.forEach(node => {
        if (
          node.trustScore >= 85 || 
          selectedNode?.id === node.id || 
          hoveredNode === node.id
        ) {
          importantNodes.push(node);
        }
      });
      
      // Process each cluster
      categoryClusters.forEach((clusterNodes, key) => {
        // If cluster is too small, just add all nodes
        if (clusterNodes.length < CLUSTER_THRESHOLD) {
          importantNodes.push(...clusterNodes);
          return;
        }
        
        // Remove important nodes from cluster
        const remainingNodes = clusterNodes.filter(node => 
          !importantNodes.some(n => n.id === node.id)
        );
        
        // Create cluster node
        const clusterId = `cluster-${key.replace(/\s+/g, '-').toLowerCase()}`;
        const avgTrustScore = Math.round(
          remainingNodes.reduce((sum, n) => sum + n.trustScore, 0) / remainingNodes.length
        );
        
        const clusterNode: NetworkNode = {
          id: clusterId,
          name: `${key} Cluster`,
          company: key,
          title: `${remainingNodes.length} contacts`,
          trustScore: avgTrustScore,
          relationshipStrength: avgTrustScore >= 80 ? 'strong' : avgTrustScore >= 60 ? 'medium' : 'weak',
          category: key
        };
        
        // Map original nodes to this cluster
        remainingNodes.forEach(node => {
          clusterMap.set(node.id, clusterId);
        });
        
        clusters.push(clusterNode);
      });
      
      // Combine important nodes and clusters
      const visibleNodes = [...importantNodes, ...clusters];
      
      // Create edges between visible nodes and clusters
      const visibleEdges: NetworkEdge[] = [];
      const processedEdges = new Set<string>();
      
      edges.forEach(edge => {
        // Skip if we've reached the edge limit
        if (visibleEdges.length >= EDGE_LIMIT) return;
        
        const sourceCluster = clusterMap.get(edge.source);
        const targetCluster = clusterMap.get(edge.target);
        
        // Case 1: Both nodes are visible
        if (
          visibleNodes.some(n => n.id === edge.source) && 
          visibleNodes.some(n => n.id === edge.target)
        ) {
          visibleEdges.push(edge);
          return;
        }
        
        // Case 2: Source is visible, target is in a cluster
        if (
          visibleNodes.some(n => n.id === edge.source) && 
          targetCluster && 
          visibleNodes.some(n => n.id === targetCluster)
        ) {
          const edgeKey = `${edge.source}-${targetCluster}`;
          if (!processedEdges.has(edgeKey)) {
            visibleEdges.push({
              id: edgeKey,
              source: edge.source,
              target: targetCluster,
              strength: edge.strength,
              type: edge.type
            });
            processedEdges.add(edgeKey);
          }
          return;
        }
        
        // Case 3: Target is visible, source is in a cluster
        if (
          visibleNodes.some(n => n.id === edge.target) && 
          sourceCluster && 
          visibleNodes.some(n => n.id === sourceCluster)
        ) {
          const edgeKey = `${sourceCluster}-${edge.target}`;
          if (!processedEdges.has(edgeKey)) {
            visibleEdges.push({
              id: edgeKey,
              source: sourceCluster,
              target: edge.target,
              strength: edge.strength,
              type: edge.type
            });
            processedEdges.add(edgeKey);
          }
          return;
        }
        
        // Case 4: Both nodes are in clusters
        if (
          sourceCluster && 
          targetCluster && 
          sourceCluster !== targetCluster &&
          visibleNodes.some(n => n.id === sourceCluster) &&
          visibleNodes.some(n => n.id === targetCluster)
        ) {
          const edgeKey = `${sourceCluster}-${targetCluster}`;
          if (!processedEdges.has(edgeKey)) {
            visibleEdges.push({
              id: edgeKey,
              source: sourceCluster,
              target: targetCluster,
              strength: Math.max(edge.strength, 0.5), // Make cluster connections stronger
              type: edge.type
            });
            processedEdges.add(edgeKey);
          }
        }
      });
      
      return {
        clusters,
        clusterMap,
        visibleNodes,
        visibleEdges: visibleEdges.slice(0, EDGE_LIMIT)
      };
    });
  }, [filteredNodes, edges, viewMode, selectedNode, hoveredNode, showAllNodes]);

  // Initialize node positions
  useEffect(() => {
    if (visibleNodes.length === 0) return;

    const newPositions = new Map<string, {x: number, y: number, vx: number, vy: number}>();
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    
    visibleNodes.forEach((node) => {
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
          const categories = [...new Set(visibleNodes.map(n => n.category))];
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
          const nodesPerRow = Math.ceil(visibleNodes.length / 5);
          const horizontalSpacing = dimensions.width / (nodesPerRow + 1);
          
          const nodeIndex = visibleNodes.findIndex(n => n.id === node.id);
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
  }, [visibleNodes, viewMode, dimensions]);

  // Force simulation with WebWorker-like optimization
  const runSimulation = useCallback(() => {
    if (!simulationRunning || visibleNodes.length === 0) return;
    
    const now = performance.now();
    const deltaTime = now - lastFrameTimeRef.current;
    lastFrameTimeRef.current = now;
    
    // Calculate FPS
    fpsCounterRef.current.push(1000 / deltaTime);
    if (fpsCounterRef.current.length > 10) {
      fpsCounterRef.current.shift();
    }
    const fps = Math.round(
      fpsCounterRef.current.reduce((sum, val) => sum + val, 0) / fpsCounterRef.current.length
    );
    
    // Start performance measurement
    const startTime = performance.now();
    
    const newPositions = new Map(nodePositions);
    
    // Apply forces
    visibleNodes.forEach(node => {
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
      
      // Node repulsion force - optimized to only check nearby nodes
      visibleNodes.forEach(otherNode => {
        if (node.id === otherNode.id || !newPositions.has(otherNode.id)) return;
        
        const otherPos = newPositions.get(otherNode.id)!;
        const dx = pos.x - otherPos.x;
        const dy = pos.y - otherPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Skip if too far away (optimization)
        if (distance > 200) return;
        
        if (distance === 0) return;
        
        // Repulsion strength based on node trust scores
        const repulsionStrength = 500 / (distance * distance);
        const repulsionFactor = Math.min(repulsionStrength, 10); // Limit max force
        
        fx += (dx / distance) * repulsionFactor;
        fy += (dy / distance) * repulsionFactor;
      });
      
      // Edge attraction force - optimized to only process visible edges
      visibleEdges.forEach(edge => {
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
    
    // Calculate render time
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Update render stats
    setRenderStats({
      nodeCount: visibleNodes.length,
      edgeCount: visibleEdges.length,
      renderTime,
      fps
    });
    
    // Continue animation
    animationFrameRef.current = requestAnimationFrame(runSimulation);
  }, [visibleNodes, visibleEdges, nodePositions, dimensions, simulationRunning]);

  // Start/stop simulation
  useEffect(() => {
    if (simulationRunning) {
      lastFrameTimeRef.current = performance.now();
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
  }, [viewMode, visibleNodes]);

  // Handle mouse events for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      setIsPanning(true);
      panStartRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && panStartRef.current) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      
      setPanOffset(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }));
      
      panStartRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    panStartRef.current = null;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setZoomLevel(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  // Expand cluster on click
  const handleNodeClick = (node: NetworkNode) => {
    // If it's a cluster node, expand it
    if (node.id.startsWith('cluster-')) {
      // Find all nodes in this cluster
      const clusterNodes = filteredNodes.filter(n => 
        clusterMap.get(n.id) === node.id
      );
      
      // Add these nodes to the visible set
      setShowAllNodes(true);
    } else {
      // Regular node click
      onNodeClick?.(node);
    }
  };

  const getNodeColor = (node: NetworkNode) => {
    if (selectedNode?.id === node.id) return '#6366F1';
    if (hoveredNode === node.id) return '#8B5CF6';
    
    // If it's a cluster node, use a special color
    if (node.id.startsWith('cluster-')) {
      return '#6366F1';
    }
    
    switch (node.relationshipStrength) {
      case 'strong': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'weak': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getNodeSize = (node: NetworkNode) => {
    // Clusters are larger
    if (node.id.startsWith('cluster-')) {
      return 15;
    }
    
    const baseSize = 8;
    const trustMultiplier = node.trustScore / 100;
    return baseSize + (trustMultiplier * 12);
  };

  const getEdgeColor = (edge: NetworkEdge) => {
    // If either end is a cluster, use a special color
    if (edge.source.startsWith('cluster-') || edge.target.startsWith('cluster-')) {
      return 'rgba(99, 102, 241, 0.4)';
    }
    
    switch (edge.type) {
      case 'direct': return 'rgba(99, 102, 241, 0.6)';
      case 'mutual': return 'rgba(16, 185, 129, 0.6)';
      case 'introduction': return 'rgba(245, 158, 11, 0.6)';
      default: return 'rgba(209, 213, 219, 0.6)';
    }
  };

  const categories = useMemo(() => [...new Set(nodes.map(node => node.category))], [nodes]);

  // Calculate transform for pan and zoom
  const svgTransform = `translate(${panOffset.x} ${panOffset.y}) scale(${zoomLevel})`;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-900 rounded-xl overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
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
              icon={showLabels ? EyeOff : Eye}
            >
              {showLabels ? 'Hide Labels' : 'Show Labels'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllNodes(!showAllNodes)}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
            >
              {showAllNodes ? 'Use Clusters' : 'Show All Nodes'}
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
          </div>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-20 right-4 flex flex-col space-y-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-1 shadow-sm">
        <button
          onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.1))}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
        <button
          onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
        <button
          onClick={() => {
            setZoomLevel(1);
            setPanOffset({ x: 0, y: 0 });
          }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          aria-label="Reset view"
        >
          <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 15L9 9M15 9L9 15" />
          </svg>
        </button>
      </div>

      {/* Network Visualization */}
      <div className="w-full h-full relative">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className="w-full h-full"
          style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
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
            
            {/* Cluster pattern */}
            <pattern id="clusterPattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="1" fill="currentColor" className="text-indigo-300 dark:text-indigo-700" />
            </pattern>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Main transform group for pan and zoom */}
          <g transform={svgTransform}>
            {/* Edges with Animation - Virtualized */}
            <g className="edges">
              <AnimatePresence>
                {visibleEdges.map((edge) => {
                  const sourceNode = visibleNodes.find(n => n.id === edge.source);
                  const targetNode = visibleNodes.find(n => n.id === edge.target);
                  
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
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: 0.6,
                        x1: sourcePos.x,
                        y1: sourcePos.y,
                        x2: targetPos.x,
                        y2: targetPos.y
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ 
                        opacity: { duration: ANIMATION_DURATION },
                        default: { duration: ANIMATION_DURATION }
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

            {/* Nodes with Animation - Virtualized */}
            <g className="nodes">
              <AnimatePresence>
                {visibleNodes.map((node) => {
                  const position = nodePositions.get(node.id);
                  if (!position) return null;
                  
                  const nodeSize = getNodeSize(node);
                  const isSelected = selectedNode?.id === node.id;
                  const isHovered = hoveredNode === node.id;
                  const isCluster = node.id.startsWith('cluster-');
                  
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
                        scale: { duration: ANIMATION_DURATION, type: "spring" },
                        opacity: { duration: ANIMATION_DURATION },
                        x: { duration: ANIMATION_DURATION, ease: "easeOut" },
                        y: { duration: ANIMATION_DURATION, ease: "easeOut" }
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
                        fill={isCluster ? 'url(#clusterPattern)' : getNodeColor(node)}
                        stroke="white"
                        strokeWidth={isSelected ? 3 : 2}
                        className="cursor-pointer transition-all duration-300 hover:stroke-indigo-400"
                        onClick={() => handleNodeClick(node)}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        animate={{
                          r: isSelected || isHovered ? nodeSize * 1.1 : nodeSize
                        }}
                        transition={{ duration: 0.2 }}
                      />
                      
                      {/* Cluster indicator */}
                      {isCluster && (
                        <motion.text
                          x={0}
                          y={0}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-xs font-medium fill-indigo-600 dark:fill-indigo-400 pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {node.title.split(' ')[0]}
                        </motion.text>
                      )}
                      
                      {/* Trust score indicator */}
                      {!isCluster && (
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
                      )}
                      
                      {/* Node labels */}
                      <AnimatePresence>
                        {showLabels && (isHovered || isSelected || nodeSize > 12 || isCluster) && (
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
                              height={isCluster ? 40 : 32}
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
                              {isCluster ? node.name.split(' ')[0] : node.name}
                            </text>
                            <text
                              x={0}
                              y={nodeSize + 30}
                              textAnchor="middle"
                              className="text-xs fill-gray-600"
                            >
                              {isCluster ? `${node.title}` : node.company}
                            </text>
                          </motion.g>
                        )}
                      </AnimatePresence>
                    </motion.g>
                  );
                })}
              </AnimatePresence>
            </g>
          </g>
        </svg>

        {/* Loading State */}
        <AnimatePresence>
          {visibleNodes.length === 0 && (
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
            <span className="text-xs text-gray-600 dark:text-gray-400">Cluster</span>
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
            {visibleNodes.length}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Nodes Visible
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {clusters.length > 0 && `${clusters.length} clusters`}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            {renderStats.renderTime.toFixed(1)}ms | {renderStats.fps} FPS
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