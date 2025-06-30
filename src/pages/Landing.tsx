import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Brain, Target, Users, Zap, MessageSquare, TrendingUp, Eye, Lightbulb } from 'lucide-react';
import Button from '../components/Button';
import LivePreviewSection from '../components/landing/LivePreviewSection';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-aqua to-lavender font-sans font-light">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20 animate-blob" style={{ backgroundColor: '#1ABC9C' }}></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full opacity-20 animate-blob animation-delay-2000" style={{ backgroundColor: '#2ECC71' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-56 h-56 rounded-full opacity-20 animate-blob animation-delay-4000" style={{ backgroundColor: '#8E44AD' }}></div>
      </div>

      {/* Header */}
      <nav className="relative z-10 flex items-center justify-between p-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <img 
            src="/OuRhizome Dark CRM Background Removed Background Removed.png" 
            alt="Rhiz Logo" 
            className="w-10 h-10"
          />
          <span className="text-2xl font-light text-white">Rhiz</span>
        </div>
        <Link to="/apply">
          <Button className="bg-gradient-to-r from-aqua via-emerald to-lavender text-white hover:shadow-lg transition-all duration-300 font-light">
            Apply for Alpha
          </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl pt-20 pb-32 sm:pt-32 sm:pb-40">
          <div className="text-center">
            <h1 className="text-4xl font-light tracking-tight text-white sm:text-6xl">
              <span className="block">
                Strengthen Your Circle
              </span>
            </h1>
            <p className="mt-6 text-lg font-light leading-8 text-white/90 max-w-3xl mx-auto">
              Rhiz transforms scattered contacts into an intelligent relationship engine. Get AI-powered trust scores, 
              goal-driven matching, and predictive insights that reveal who to reach, when to connect, and why it matters.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/apply">
                <Button size="lg" icon={ArrowRight} className="bg-gradient-to-r from-aqua via-emerald to-lavender text-white shadow-2xl hover:shadow-emerald/25 transition-all duration-300 font-light">
                  Apply for Alpha Access
                </Button>
              </Link>
            </div>
            
            {/* Social Proof */}
            <div className="mt-8 flex items-center justify-center space-x-8 text-sm font-light text-white/80">
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
      <div className="relative z-10 py-24 sm:py-32 bg-white/10 backdrop-blur-md border-t border-emerald/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-light tracking-tight text-white sm:text-4xl">
              Intelligence meets relationships
            </h2>
            <p className="mt-6 text-lg font-light leading-8 text-white/90">
              Move beyond static contact lists. Rhiz creates a living, breathing network that grows smarter with every interaction.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col items-center text-center group">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-tr from-emerald to-aqua group-hover:bg-gradient-to-tr group-hover:from-lavender group-hover:to-emerald transition-all duration-300 shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <dt className="text-base font-light leading-7 text-white">
                  Living Network Graph
                </dt>
                <dd className="mt-1 text-base font-light leading-7 text-white/80">
                  Your contacts become a unified, intelligent graph that reveals hidden connections, mutual relationships, and strategic opportunities.
                </dd>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-tr from-emerald to-aqua group-hover:bg-gradient-to-tr group-hover:from-lavender group-hover:to-emerald transition-all duration-300 shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <dt className="text-base font-light leading-7 text-white">
                  Goal-Driven Matching
                </dt>
                <dd className="mt-1 text-base font-light leading-7 text-white/80">
                  Whether fundraising, hiring, or building partnerships, AI instantly matches you with the right people based on your objectives.
                </dd>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-tr from-emerald to-aqua group-hover:bg-gradient-to-tr group-hover:from-lavender group-hover:to-emerald transition-all duration-300 shadow-lg">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <dt className="text-base font-light leading-7 text-white">
                  AI Relationship Assistant
                </dt>
                <dd className="mt-1 text-base font-light leading-7 text-white/80">
                  Uncover hidden opportunities, predict relationship risks, and get personalized outreach strategies powered by advanced AI.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Live Preview Section */}
      <LivePreviewSection />

      {/* Advanced Features */}
      <div className="relative z-10 py-24 sm:py-32 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-light leading-7 bg-gradient-to-r from-aqua to-lavender bg-clip-text text-transparent">
              Beyond Contact Management
            </h2>
            <p className="mt-2 text-3xl font-light tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Trust scores, predictive insights, and relationship intelligence
            </p>
            <p className="mt-6 text-lg font-light leading-8 text-gray-600 dark:text-gray-300">
              Every contact gets a dynamic trust score based on interaction history, response patterns, and mutual connections. 
              See relationship health at a glance and get AI-powered recommendations.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-light leading-7 text-gray-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-aqua to-emerald">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  Dynamic Trust Scoring
                </dt>
                <dd className="mt-2 text-base font-light leading-7 text-gray-600 dark:text-gray-300">
                  Real-time trust scores based on response patterns, interaction frequency, and relationship depth. Spot at-risk connections before they go dormant.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-light leading-7 text-gray-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-emerald to-lavender">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  Predictive Relationship Analytics
                </dt>
                <dd className="mt-2 text-base font-light leading-7 text-gray-600 dark:text-gray-300">
                  AI predicts optimal outreach timing, identifies dormant high-value relationships, and suggests strategic introductions.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-light leading-7 text-gray-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-lavender to-aqua">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  Intelligent Outreach Automation
                </dt>
                <dd className="mt-2 text-base font-light leading-7 text-gray-600 dark:text-gray-300">
                  Generate personalized messages, schedule follow-ups, and track engagement all tuned to your communication style and relationship context.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-light leading-7 text-gray-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-aqua via-emerald to-lavender">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                  Goal-Aligned Recommendations
                </dt>
                <dd className="mt-2 text-base font-light leading-7 text-gray-600 dark:text-gray-300">
                  Set fundraising, hiring, or partnership goals and get matched with contacts who can help, plus strategic introduction paths.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Trust & Privacy */}
      <div className="relative z-10 py-24 sm:py-32 bg-white/10 backdrop-blur-md border-emerald/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-light leading-7 bg-gradient-to-r from-emerald to-aqua bg-clip-text text-transparent">
              Enterprise-Grade Security
            </h2>
            <p className="mt-2 text-3xl font-light tracking-tight text-white sm:text-4xl">
              Your relationships, your control
            </p>
            <p className="mt-6 text-lg font-light leading-8 text-white/90">
              Built with zero-knowledge architecture and end-to-end encryption. Your relationship data stays private 
              while you get the intelligence you need.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-light leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-emerald to-aqua">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  Zero-Knowledge Privacy
                </dt>
                <dd className="mt-2 text-base font-light leading-7 text-white/80">
                  End-to-end encryption ensures we can't access your decrypted relationship data. You control what's shared and with whom.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-light leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-aqua to-lavender">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  Smart Data Enrichment
                </dt>
                <dd className="mt-2 text-base font-light leading-7 text-white/80">
                  Automatically merge duplicates, enrich profiles with public data, and track job changes all with explicit consent.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-light leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-lavender to-emerald">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  Seamless Integrations
                </dt>
                <dd className="mt-2 text-base font-light leading-7 text-white/80">
                  Connect LinkedIn, Gmail, Outlook, and more. Import contacts intelligently while maintaining privacy controls.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-light leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-emerald via-aqua to-lavender">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  Relationship Health Monitoring
                </dt>
                <dd className="mt-2 text-base font-light leading-7 text-white/80">
                  Get alerts when relationships need attention, track engagement trends, and maintain your most valuable connections.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Future Vision */}
      <div className="relative z-10 bg-gradient-to-r from-lavender to-emerald">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-light tracking-tight text-white sm:text-4xl">
              Today: Intelligent PWA. Tomorrow: Decentralized Protocol.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg font-light leading-8 text-white/90">
              Rhiz is evolving into a decentralized relationship protocol with token incentives and AI agent support
              powering ecosystems of human and artificial intelligence collaboration.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/apply">
                <Button variant="outline" size="lg" className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 transition-all duration-300 font-light">
                  Join the Alpha
                </Button>
              </Link>
            </div>
            
            {/* Alpha Status */}
            <div className="mt-8 inline-flex items-center space-x-2 bg-gradient-to-br from-lavender to-emerald rounded-full px-4 py-2 shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm text-white font-light">Limited Alpha • 66 spots remaining</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;