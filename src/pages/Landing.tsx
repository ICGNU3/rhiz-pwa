import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Network, Shield, Brain, Target, Users, Zap, MessageSquare, TrendingUp, Eye, Lightbulb } from 'lucide-react';
import Button from '../components/Button';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Header */}
      <nav className="flex items-center justify-between p-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Network className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">Rhiz</span>
        </div>
        <Link to="/apply">
          <Button>Apply for Alpha</Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-4xl pt-20 pb-32 sm:pt-32 sm:pb-40">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Drowning in contacts but
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                losing real connections?
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Rhiz transforms scattered contacts into an intelligent relationship engine. Get AI-powered trust scores, 
              goal-driven matching, and predictive insights that reveal who to reach, when to connect, and why it matters.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/apply">
                <Button size="lg" icon={ArrowRight}>
                  Apply for Alpha Access
                </Button>
              </Link>
            </div>
            
            {/* Social Proof */}
            <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>AI-Powered Insights</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Predictive Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Features */}
      <div className="py-24 sm:py-32 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Intelligence meets relationships
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Move beyond static contact lists. Rhiz creates a living, breathing network that grows smarter with every interaction.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                  <Network className="h-8 w-8 text-white" />
                </div>
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  Living Network Graph
                </dt>
                <dd className="mt-1 text-base leading-7 text-gray-600 dark:text-gray-300">
                  Your contacts become a unified, intelligent graph that reveals hidden connections, mutual relationships, and strategic opportunities.
                </dd>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  Goal-Driven Matching
                </dt>
                <dd className="mt-1 text-base leading-7 text-gray-600 dark:text-gray-300">
                  Whether fundraising, hiring, or building partnerships, AI instantly matches you with the right people based on your objectives.
                </dd>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  AI Relationship Assistant
                </dt>
                <dd className="mt-1 text-base leading-7 text-gray-600 dark:text-gray-300">
                  Uncover hidden opportunities, predict relationship risks, and get personalized outreach strategies powered by advanced AI.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">
              Beyond Contact Management
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Trust scores, predictive insights, and relationship intelligence
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Every contact gets a dynamic trust score based on interaction history, response patterns, and mutual connections. 
              See relationship health at a glance and get AI-powered recommendations.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  Dynamic Trust Scoring
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                  Real-time trust scores based on response patterns, interaction frequency, and relationship depth. Spot at-risk connections before they go dormant.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  Predictive Relationship Analytics
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                  AI predicts optimal outreach timing, identifies dormant high-value relationships, and suggests strategic introductions.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  Intelligent Outreach Automation
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                  Generate personalized messages, schedule follow-ups, and track engagement—all tuned to your communication style and relationship context.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                  Goal-Aligned Recommendations
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                  Set fundraising, hiring, or partnership goals and get matched with contacts who can help, plus strategic introduction paths.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Trust & Privacy */}
      <div className="py-24 sm:py-32 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">
              Enterprise-Grade Security
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Your relationships, your control
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Built with zero-knowledge architecture and end-to-end encryption. Your relationship data stays private 
              while you get the intelligence you need.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  Zero-Knowledge Privacy
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                  End-to-end encryption ensures we can't access your decrypted relationship data. You control what's shared and with whom.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  Smart Data Enrichment
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                  Automatically merge duplicates, enrich profiles with public data, and track job changes—all with explicit consent.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  Seamless Integrations
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                  Connect LinkedIn, Gmail, Outlook, and more. Import contacts intelligently while maintaining privacy controls.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  Relationship Health Monitoring
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                  Get alerts when relationships need attention, track engagement trends, and maintain your most valuable connections.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Future Vision */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-800">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Today: Intelligent PWA. Tomorrow: Decentralized Protocol.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100">
              Rhiz is evolving into a decentralized relationship protocol with token incentives and AI agent support—
              powering ecosystems of human and artificial intelligence collaboration.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/apply">
                <Button variant="outline" size="lg" className="bg-white text-indigo-600 hover:bg-gray-50 border-white">
                  Join the Alpha
                </Button>
              </Link>
            </div>
            
            {/* Alpha Status */}
            <div className="mt-8 inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-white font-medium">Limited Alpha • 66 spots remaining</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;