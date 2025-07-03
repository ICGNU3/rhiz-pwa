import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { ArrowRight, Users, Target, Brain, Shield, Zap, CheckCircle, Star, TrendingUp, Clock } from 'lucide-react';
import LivePreviewSection from '../components/landing/LivePreviewSection';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-emerald-600/20"></div>
        <div className="relative px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
              <Star className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-sm text-white/90">Join 2,000+ founders already on the waitlist</span>
            </div>
            
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl mb-6">
              <span className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                The Relationship
              </span>
              <span className="block bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
                Operating System
              </span>
            </h1>
            
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8 leading-relaxed">
              Rhiz transforms scattered relationships into living networks. Get AI-powered insights that reveal 
              who to connect with, when to reach out, and how to nurture meaningful relationships across all life contexts.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link to="/root-membership">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-emerald-600 text-white shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 font-semibold px-8 py-4">
                  Get Early Access
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <div className="flex items-center text-white/70">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">Limited availability</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-8 text-white/60 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
                <span>2-minute setup</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
                <span>Lifetime access</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
                <span>Exclusive benefits</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Section */}
      <div className="relative z-10">
        <LivePreviewSection />
      </div>

      {/* Social Proof */}
      <div className="relative z-10 px-6 lg:px-8 py-16 bg-white/5 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-white/60 text-sm mb-8">Trusted by founders and executives at</p>
          <div className="flex items-center justify-center space-x-12 opacity-60">
            <div className="text-white/40 text-lg font-semibold">YC</div>
            <div className="text-white/40 text-lg font-semibold">Techstars</div>
            <div className="text-white/40 text-lg font-semibold">500 Startups</div>
            <div className="text-white/40 text-lg font-semibold">Founders Fund</div>
          </div>
        </div>
      </div>

      {/* Value Props */}
      <div className="relative z-10 px-6 lg:px-8 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white sm:text-5xl mb-6">
              Nurture Every Connection
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Your relationships are your foundation. Rhiz helps you cultivate them across all life contexts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">AI-Powered Intelligence</h3>
              <p className="text-white/70">Get predictive insights about relationship strength, timing, and connection potential.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Strategic Matching</h3>
              <p className="text-white/70">Connect with the right people at the right time based on your life goals and values.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Relationship Analytics</h3>
              <p className="text-white/70">Track engagement, measure trust scores, and optimize your relationship strategy.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Privacy-First</h3>
              <p className="text-white/70">Your data stays yours. Enterprise-grade security with complete data control.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Instant Setup</h3>
              <p className="text-white/70">Import your contacts in seconds. Start getting insights immediately.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Community Building</h3>
              <p className="text-white/70">Share insights, coordinate outreach, and align your community's relationship strategy.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="relative z-10 px-6 lg:px-8 py-24 bg-white/5 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white sm:text-5xl mb-16">
            Three Steps to Relationship Mastery
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Connect</h3>
              <p className="text-white/70">Import your contacts and let AI organize them into meaningful life contexts.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Analyze</h3>
              <p className="text-white/70">Get trust scores, opportunity alerts, and strategic recommendations.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Activate</h3>
              <p className="text-white/70">Reach out with purpose and turn dormant relationships into active connections.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="relative z-10 px-6 lg:px-8 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white sm:text-5xl mb-12">
            Our Mission
          </h2>
          
          <div className="space-y-8 text-lg text-white/80 leading-relaxed">
            <p>
              <strong className="text-white">Rhiz builds the infrastructure for human connection.</strong> We help people remember who they know, why it matters, and what becomes possible when those connections are reactivated with purpose.
            </p>
            
            <p>
              Our mission is to <strong className="text-white">transform forgotten contacts into living networks.</strong> We create tools that organize trust, surface hidden relationships, and restore access to the people and ideas that move us forward.
            </p>
            
            <p>
              Rhiz exists to make coordination intuitive. We turn scattered social data into meaningful action by helping individuals and communities reassemble the relationships that already belong to them.
            </p>
            
            <p className="text-2xl font-bold text-white/95">
              <strong>We believe relationships are capital. Memory is infrastructure. Coordination is freedom. Rhiz is how we make it usable.</strong>
            </p>
          </div>
        </div>
      </div>



      {/* FAQ */}
      <div className="relative z-10 px-6 lg:px-8 py-24 bg-white/5 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-white sm:text-5xl text-center mb-16">
            Common Questions
          </h2>
          
          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">How much does Rhiz cost?</h3>
              <p className="text-white/70">Rhiz offers exclusive founding membership with lifetime access and premium benefits. Details available when you apply.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Is my data secure?</h3>
              <p className="text-white/70">Absolutely. We use enterprise-grade encryption and keep your data private. Your network stays yours.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">What makes Rhiz different?</h3>
              <p className="text-white/70">Rhiz focuses on relationship intelligence and predictive analytics, helping you understand who you know and how to leverage those connections strategically.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">How long is the alpha?</h3>
              <p className="text-white/70">We expect the alpha to last 3-6 months. Founding members get early access to all features and influence our roadmap.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 px-6 lg:px-8 py-12 border-t border-white/10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-white/60 text-sm">
              © 2025 Rhiz. Building the infrastructure for human connection.
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-white/60 text-sm hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-white/60 text-sm hover:text-white transition-colors">
                Terms
              </Link>
              <Link to="/contact" className="text-white/60 text-sm hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;