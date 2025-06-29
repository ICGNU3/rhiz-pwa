import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Network as NetworkIcon, Users, Building, MapPin, GitBranch, Zap, TrendingUp, Search, Filter, BarChart3 } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import ContactCard from '../components/contacts/ContactCard';
import ContactSearch from '../components/contacts/ContactSearch';
import NetworkGraph from '../components/network/NetworkGraph';
import { getNetworkData } from '../api/network';

interface NetworkNode {
  id: string;
  name: string;
  company: string;
  title: string;
  trustScore: number;
  relationshipStrength: 'strong' | 'medium' | 'weak';
  category: string;
}

const Network: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [relationshipFilter, setRelationshipFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: networkData, isLoading, error } = useQuery({
    queryKey: ['network-data'],
    queryFn: getNetworkData,
  });

  const handleNodeClick = (node: NetworkNode) => {
    setSelectedNode(node);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Building your network graph...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Failed to load network data
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  const networkInsights = [
    {
      title: 'Hidden Connections',
      description: 'Sarah Chen and Michael Rodriguez both worked at TechCorp - potential introduction opportunity',
      action: 'Facilitate Introduction',
      type: 'opportunity',
      impact: 'High'
    },
    {
      title: 'Network Gap',
      description: 'Your network lacks senior executives in the fintech space for your fundraising goal',
      action: 'Find Connections',
      type: 'gap',
      impact: 'Medium'
    },
    {
      title: 'Strong Cluster',
      description: 'You have a dense cluster of AI/ML professionals - leverage for technical partnerships',
      action: 'Explore Cluster',
      type: 'strength',
      impact: 'High'
    },
    {
      title: 'Weak Links',
      description: '5 connections haven\'t been contacted in 90+ days and risk becoming dormant',
      action: 'Re-engage',
      type: 'risk',
      impact: 'Medium'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Network Intelligence
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Visualize your living relationship graph and discover hidden connection patterns
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              icon={BarChart3}
              className="bg-white/80 backdrop-blur-sm border-indigo-200 hover:bg-indigo-50"
            >
              Analytics
            </Button>
            <Button 
              icon={Zap} 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25"
            >
              Analyze Network
            </Button>
          </div>
        </div>

        {/* Network Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-indigo-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {networkData?.totalConnections || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Connections</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {networkData?.newConnections || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">New This Month</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <GitBranch className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {networkData?.networkDensity || 75}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Network Density</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <NetworkIcon className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {networkData?.diversityScore || 82}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Diversity Score</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Network Visualization */}
          <div className="lg:col-span-3">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Interactive Network Graph
                </h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" icon={Filter}>
                    Filters
                  </Button>
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                </div>
              </div>
              
              <div className="h-96 lg:h-[600px]">
                <NetworkGraph
                  nodes={networkData?.nodes || []}
                  edges={networkData?.edges || []}
                  onNodeClick={handleNodeClick}
                  selectedNode={selectedNode}
                />
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Search */}
            <Card className="p-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Search Network
              </h3>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>
                <select
                  value={relationshipFilter}
                  onChange={(e) => setRelationshipFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="all">All Relationships</option>
                  <option value="strong">Strong</option>
                  <option value="medium">Medium</option>
                  <option value="weak">Weak</option>
                </select>
              </div>
            </Card>

            {/* Selected Contact Detail */}
            {selectedNode && (
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Contact Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {selectedNode.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {selectedNode.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedNode.title}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Company:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedNode.company}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Trust Score:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedNode.trustScore}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Relationship:</span>
                        <span className={`text-sm font-medium ${
                          selectedNode.relationshipStrength === 'strong' ? 'text-green-600' :
                          selectedNode.relationshipStrength === 'medium' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {selectedNode.relationshipStrength}
                        </span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <Button size="sm" className="w-full">
                        View Full Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Quick Stats */}
            <Card className="p-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Network Health
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Density</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {networkData?.networkDensity || 75}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div 
                      className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                      style={{ width: `${networkData?.networkDensity || 75}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Diversity</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {networkData?.diversityScore || 82}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div 
                      className="h-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                      style={{ width: `${networkData?.diversityScore || 82}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Network Intelligence Insights */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Network Intelligence Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {networkInsights.map((insight, index) => {
              const typeColors = {
                opportunity: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20',
                gap: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20',
                strength: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20',
                risk: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
              };
              
              const typeIcons = {
                opportunity: <Zap className="w-5 h-5 text-green-600" />,
                gap: <GitBranch className="w-5 h-5 text-yellow-600" />,
                strength: <TrendingUp className="w-5 h-5 text-blue-600" />,
                risk: <Users className="w-5 h-5 text-red-600" />
              };
              
              return (
                <div key={index} className={`p-5 rounded-xl border ${typeColors[insight.type as keyof typeof typeColors]} transition-all duration-200 hover:shadow-md`}>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {typeIcons[insight.type as keyof typeof typeIcons]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {insight.title}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          insight.impact === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}>
                          {insight.impact} Impact
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        {insight.description}
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        {insight.action}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Top Companies and Locations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Building className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Top Companies
              </h3>
            </div>
            <div className="space-y-3">
              {networkData?.topCompanies?.slice(0, 5).map((company: { name: string; count: number }, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-gray-900 dark:text-white font-medium">{company.name}</span>
                  <span className="text-sm bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 py-1 rounded-full">
                    {company.count}
                  </span>
                </div>
              )) || (
                <p className="text-gray-500 dark:text-gray-400 italic text-center py-4">
                  Building company analysis...
                </p>
              )}
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Geographic Reach
              </h3>
            </div>
            <div className="space-y-3">
              {networkData?.topLocations?.slice(0, 5).map((location: { name: string; count: number }, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-gray-900 dark:text-white font-medium">{location.name}</span>
                  <span className="text-sm bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                    {location.count}
                  </span>
                </div>
              )) || (
                <p className="text-gray-500 dark:text-gray-400 italic text-center py-4">
                  Mapping global network...
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Network;