import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Network as NetworkIcon, Users, Building, MapPin, GitBranch, Zap, TrendingUp } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { getNetworkData } from '../api/network';

const Network: React.FC = () => {
  const { data: networkData, isLoading } = useQuery({
    queryKey: ['network-data'],
    queryFn: getNetworkData,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const networkInsights = [
    {
      title: 'Hidden Connections',
      description: 'Sarah Chen and Michael Rodriguez both worked at TechCorp - potential introduction opportunity',
      action: 'Facilitate Introduction',
      type: 'opportunity'
    },
    {
      title: 'Network Gap',
      description: 'Your network lacks senior executives in the fintech space for your fundraising goal',
      action: 'Find Connections',
      type: 'gap'
    },
    {
      title: 'Strong Cluster',
      description: 'You have a dense cluster of AI/ML professionals - leverage for technical partnerships',
      action: 'Explore Cluster',
      type: 'strength'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Network Graph</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Visualize your living relationship graph and discover hidden connection patterns.
          </p>
        </div>
        <Button icon={Zap}>
          Analyze Network
        </Button>
      </div>

      {/* Network Visualization */}
      <Card>
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Interactive Network Visualization
            </h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Filter by Goal
              </Button>
              <Button variant="outline" size="sm">
                Show Trust Scores
              </Button>
            </div>
          </div>
          
          <div className="h-96 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-700 dark:via-gray-600 dark:to-gray-500 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-500 relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
              <div className="absolute top-20 right-20 w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-300"></div>
              <div className="absolute bottom-20 left-20 w-4 h-4 bg-pink-500 rounded-full animate-pulse delay-700"></div>
              <div className="absolute bottom-10 right-10 w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-1000"></div>
              
              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full">
                <line x1="10%" y1="20%" x2="80%" y2="30%" stroke="currentColor" strokeWidth="1" className="text-indigo-300 dark:text-indigo-600" strokeDasharray="5,5">
                  <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite"/>
                </line>
                <line x1="20%" y1="80%" x2="70%" y2="40%" stroke="currentColor" strokeWidth="1" className="text-purple-300 dark:text-purple-600" strokeDasharray="5,5">
                  <animate attributeName="stroke-dashoffset" values="0;10" dur="3s" repeatCount="indefinite"/>
                </line>
                <line x1="80%" y1="70%" x2="30%" y2="60%" stroke="currentColor" strokeWidth="1" className="text-pink-300 dark:text-pink-600" strokeDasharray="5,5">
                  <animate attributeName="stroke-dashoffset" values="0;10" dur="2.5s" repeatCount="indefinite"/>
                </line>
              </svg>
            </div>
            
            <div className="text-center z-10">
              <NetworkIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Interactive Network Graph
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mb-4">
                Your relationship graph is being built from your contacts, interactions, and shared goals. 
                Soon you'll see how everyone connects and discover hidden opportunities.
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  <span>Strong Connections</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Mutual Connections</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                  <span>Goal Alignment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Network Intelligence */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Network Intelligence Insights
          </h3>
          <div className="space-y-4">
            {networkInsights.map((insight, index) => {
              const typeColors = {
                opportunity: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20',
                gap: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20',
                strength: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
              };
              
              const typeIcons = {
                opportunity: <Zap className="w-5 h-5 text-green-600" />,
                gap: <GitBranch className="w-5 h-5 text-yellow-600" />,
                strength: <TrendingUp className="w-5 h-5 text-blue-600" />
              };
              
              return (
                <div key={index} className={`p-4 rounded-lg border ${typeColors[insight.type as keyof typeof typeColors]}`}>
                  <div className="flex items-start space-x-3">
                    {typeIcons[insight.type as keyof typeof typeIcons]}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {insight.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {insight.description}
                      </p>
                      <Button variant="outline" size="sm">
                        {insight.action}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Network Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Connection Strength
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Strong</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="w-16 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">80%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Medium</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="w-8 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">40%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Weak</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="w-4 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">20%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Building className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Top Industries
              </h3>
            </div>
            <div className="space-y-2">
              {networkData?.topCompanies?.slice(0, 4).map((company: { name: string; count: number }, index: number) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 truncate text-sm">{company.name}</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">
                    {company.count}
                  </span>
                </div>
              )) || (
                <p className="text-gray-500 dark:text-gray-400 italic text-sm">Building industry map...</p>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Geographic Reach
              </h3>
            </div>
            <div className="space-y-2">
              {networkData?.topLocations?.slice(0, 4).map((location: { name: string; count: number }, index: number) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 truncate text-sm">{location.name}</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">
                    {location.count}
                  </span>
                </div>
              )) || (
                <p className="text-gray-500 dark:text-gray-400 italic text-sm">Mapping global network...</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Network Health Metrics */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Network Health & Diversity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Network Density
                </h4>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {networkData?.networkDensity || 75}%
                </span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div 
                  className="h-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000" 
                  style={{ width: `${networkData?.networkDensity || 75}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                How interconnected your contacts are with each other
              </p>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Diversity Score
                </h4>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {networkData?.diversityScore || 82}%
                </span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div 
                  className="h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-1000" 
                  style={{ width: `${networkData?.diversityScore || 82}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Variety across industries, roles, and geographic locations
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Network;