import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TrustChartProps {
  data: Array<{ date: string; score: number }>;
  className?: string;
  small?: boolean;
}

export default function TrustChart({ data, className = '', small = false }: TrustChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className={`${small ? 'h-32' : 'h-64'} flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">No trust score data available</p>
      </div>
    );
  }

  const maxScore = Math.max(...data.map(d => d.score));
  const minScore = Math.min(...data.map(d => d.score));
  const scoreRange = maxScore - minScore || 1;
  
  // Calculate trend
  const firstScore = data[0]?.score || 0;
  const lastScore = data[data.length - 1]?.score || 0;
  const trend = lastScore - firstScore;
  const trendPercentage = ((trend / firstScore) * 100).toFixed(1);

  // Generate SVG path
  const width = 400;
  const height = small ? 120 : 200;
  const padding = small ? 20 : 40;
  
  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((point.score - minScore) / scoreRange) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  const pathData = `M ${points.split(' ').join(' L ')}`;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 ${className}`}>
      {!small && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Trust Score Timeline
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {data.length}-day relationship trust evolution
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {trend >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
            <span className={`text-sm font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '+' : ''}{trendPercentage}%
            </span>
          </div>
        </div>
      )}

      <div className="relative">
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-200 dark:text-gray-700" opacity="0.3"/>
            </pattern>
            
            {/* Gradient area under the line */}
            <linearGradient id="trustGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.05"/>
            </linearGradient>
            
            {/* Glow effect for line */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Gradient area under the line */}
          <path
            d={`${pathData} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`}
            fill="url(#trustGradient)"
          />

          {/* Main line with glow effect */}
          <path
            d={pathData}
            fill="none"
            stroke="#6366F1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* Data points */}
          {data.map((point, index) => {
            const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
            const y = height - padding - ((point.score - minScore) / scoreRange) * (height - 2 * padding);
            
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill="#6366F1"
                  stroke="white"
                  strokeWidth="2"
                  className="hover:r-8 transition-all duration-200 cursor-pointer"
                />
                <circle
                  cx={x}
                  cy={y}
                  r="12"
                  fill="transparent"
                  className="hover:fill-indigo-100 dark:hover:fill-indigo-900 transition-all duration-200 cursor-pointer"
                >
                  <title>{`${new Date(point.date).toLocaleDateString()}: ${point.score}`}</title>
                </circle>
              </g>
            );
          })}

          {!small && (
            <>
              {/* Y-axis labels */}
              {[0, 25, 50, 75, 100].map((value) => {
                const y = height - padding - ((value - minScore) / scoreRange) * (height - 2 * padding);
                return (
                  <g key={value}>
                    <text
                      x={padding - 10}
                      y={y + 4}
                      textAnchor="end"
                      className="text-xs fill-gray-500 dark:fill-gray-400"
                    >
                      {value}
                    </text>
                    <line
                      x1={padding}
                      y1={y}
                      x2={width - padding}
                      y2={y}
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-gray-200 dark:text-gray-700"
                      opacity="0.5"
                    />
                  </g>
                );
              })}

              {/* X-axis labels */}
              {data.map((point, index) => {
                if (index % Math.ceil(data.length / 4) === 0) {
                  const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
                  return (
                    <text
                      key={index}
                      x={x}
                      y={height - 10}
                      textAnchor="middle"
                      className="text-xs fill-gray-500 dark:fill-gray-400"
                    >
                      {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </text>
                  );
                }
                return null;
              })}
            </>
          )}
        </svg>

        {/* Current score indicator */}
        <div className="absolute top-4 right-4 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg p-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {lastScore}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Current Score
            </div>
          </div>
        </div>

        {/* Trend indicator for small charts */}
        {small && (
          <div className="absolute top-2 right-2 flex items-center space-x-1">
            {trend >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
            <span className={`text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '+' : ''}{trendPercentage}%
            </span>
          </div>
        )}
      </div>

      {/* Summary stats for full chart */}
      {!small && (
        <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {Math.round((data.reduce((sum, d) => sum + d.score, 0) / data.length))}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Average Score
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {maxScore}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Peak Score
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {data.filter((d, i, arr) => i === 0 || d.score > arr[i-1].score).length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Improvements
            </div>
          </div>
        </div>
      )}
    </div>
  );
}