import React from 'react';

const demoGrowth = [
  { month: 'Jan', value: 10 },
  { month: 'Feb', value: 15 },
  { month: 'Mar', value: 22 },
  { month: 'Apr', value: 30 },
  { month: 'May', value: 40 },
  { month: 'Jun', value: 55 },
];
const demoConnectors = [
  { name: 'Alice', value: 12 },
  { name: 'Bob', value: 9 },
  { name: 'Sarah', value: 8 },
  { name: 'Michael', value: 7 },
];
const demoIndustries = [
  { sector: 'Tech', value: 20 },
  { sector: 'Finance', value: 10 },
  { sector: 'Nonprofit', value: 8 },
  { sector: 'Consulting', value: 6 },
];
const demoInfluence = [
  { name: 'Alice', value: 90 },
  { name: 'Sarah', value: 80 },
  { name: 'Bob', value: 60 },
  { name: 'Michael', value: 50 },
];

export default function NetworkAnalytics() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Network Analytics</h1>
      {/* Network Growth */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Network Growth</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow mb-2">[Line Chart Placeholder]</div>
        <div className="text-xs text-gray-500">Demo: {demoGrowth.map(d => `${d.month}: ${d.value}`).join(', ')}</div>
      </section>
      {/* Top Connectors */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Top Connectors</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow mb-2">[Bar Chart Placeholder]</div>
        <div className="text-xs text-gray-500">Demo: {demoConnectors.map(d => `${d.name}: ${d.value}`).join(', ')}</div>
      </section>
      {/* Industry Clustering */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Industry Clustering</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow mb-2">[Pie Chart Placeholder]</div>
        <div className="text-xs text-gray-500">Demo: {demoIndustries.map(d => `${d.sector}: ${d.value}`).join(', ')}</div>
      </section>
      {/* Influence Mapping */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Influence Mapping</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow mb-2">[Bar Chart Placeholder]</div>
        <div className="text-xs text-gray-500">Demo: {demoInfluence.map(d => `${d.name}: ${d.value}`).join(', ')}</div>
      </section>
    </div>
  );
} 