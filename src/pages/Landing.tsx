import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Network, Shield, Brain, Target, Users, Zap, MessageSquare } from 'lucide-react';
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
              Turn scattered contacts into an
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                intelligent relationship engine
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Rhiz syncs your phone, email, and social contacts into one living graph. It deduplicates, 
              enriches, and visualizes your network so you instantly see who matters most—with trust scores 
              built from interaction history and shared goals.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/apply">
                <Button size="lg" icon={ArrowRight}>
                  Apply for Alpha Access
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Core Features */}
      <div className="py-24 sm:py-32 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Goals drive everything
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Define what you're working toward and Rhiz matches you with the best people in your graph.
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
                  Your contacts become a unified, intelligent graph that reveals hidden connections and opportunities.
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
                  Whether fundraising, hiring, or building partnerships, get matched with the right people instantly.
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
                  Uncover hidden opportunities, craft personalized outreach, and spot at-risk relationships.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Trust & Intelligence */}
      <div className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">
              Trust-First Intelligence
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Every contact carries a trust score
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Built from interaction history, sentiment data, and shared goals—so you always know 
              where your relationship health stands.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  Smart Deduplication & Enrichment
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                  Automatically merge duplicate contacts and enrich profiles with social data, job changes, and mutual connections.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  AI-Powered Outreach
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                  Generate personalized messages tuned to your style, with automatic follow-up scheduling and progress tracking.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  Life Event Alerts
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                  Get notified of job changes, anniversaries, and engagement pattern shifts that create reconnection opportunities.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  Privacy-First Architecture
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                  Your data stays encrypted under your control. Integrations happen with explicit consent—you decide what's shared.
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
              Today: Sleek PWA. Tomorrow: Decentralized Protocol.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100">
              Rhiz is preparing to evolve into a decentralized protocol with token-based incentives 
              and support for autonomous agents—powering whole ecosystems of human and AI collaboration.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/apply">
                <Button variant="outline" size="lg" className="bg-white text-indigo-600 hover:bg-gray-50 border-white">
                  Apply for Alpha Access
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;