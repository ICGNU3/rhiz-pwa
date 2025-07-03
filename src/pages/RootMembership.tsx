import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { ArrowRight, Star, Users, Brain, Shield, Zap, CheckCircle, Crown, Target, TrendingUp, Clock, Lock } from 'lucide-react';

const RootMembership: React.FC = () => {
  const claimedSpots = 47; // This would be dynamic in production
  const remainingSpots = 100 - claimedSpots;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-emerald-600/20"></div>
        <div className="relative px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-full border border-yellow-500/30 mb-8">
              <Crown className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-sm text-yellow-100 font-medium">Foundational Tier - Only 100 Ever</span>
            </div>
            
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl mb-6">
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Root Membership
              </span>
              <span className="block text-3xl sm:text-4xl font-medium text-white/80 mt-4">
                Be One of the First 100
              </span>
            </h1>
            
            <p className="text-xl text-white/80 max-w-4xl mx-auto mb-8 leading-relaxed">
              <strong className="text-white">Root Membership is co-founding the future of meaningful relationships.</strong>
            </p>
            
            <p className="text-lg text-white/70 max-w-3xl mx-auto mb-12">
              You're becoming part of the living infrastructure that powers human connection across all life contexts.
            </p>
            
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/20 mb-12 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-8 text-white/80 text-sm mb-6">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-yellow-400" />
                  <span>Lifetime access</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-yellow-400" />
                  <span>10 annual memberships</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-yellow-400" />
                  <span>Never available again</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">$999</div>
                <div className="text-white/60 text-sm">One-time investment</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 font-semibold px-8 py-4">
                Claim Your Root Membership
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            
            <div className="flex items-center justify-center text-white/60 text-sm">
              <Clock className="w-4 h-4 mr-2" />
              <span>Only {remainingSpots} spots remaining of 100 total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative z-10 px-6 lg:px-8 py-8 bg-white/5 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between text-white/80 text-sm mb-2">
            <span>Root Memberships Claimed</span>
            <span>{claimedSpots}/100</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${(claimedSpots / 100) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="relative z-10 px-6 lg:px-8 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white sm:text-5xl mb-6">
              Complete Root Membership Benefits
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Root Members are the architects who shape how the next generation builds, maintains, and nurtures meaningful relationships across all life contexts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-yellow-500/20 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Permanent Digital Legacy</h3>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>• Root Ledger Inscription</li>
                <li>• Co-founder Recognition</li>
                <li>• Historical Significance</li>
              </ul>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-yellow-500/20 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Priority Access & Influence</h3>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>• First Access to Everything</li>
                <li>• Algorithm Training Partner</li>
                <li>• Product Influence</li>
              </ul>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-yellow-500/20 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Network Multipliers</h3>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>• 10 Annual Memberships</li>
                <li>• First-Circle Proximity</li>
                <li>• Network Effect Amplification</li>
              </ul>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-yellow-500/20 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Exclusive Intelligence Layer</h3>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>• Signal Mode Access</li>
                <li>• Life Context Insights</li>
                <li>• Relationship Memory</li>
              </ul>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-yellow-500/20 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Stewardship Power</h3>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>• Algorithm Influence</li>
                <li>• Human Blueprint</li>
                <li>• Community Governance</li>
              </ul>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-yellow-500/20 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Lifetime Value</h3>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>• No Annual Fees</li>
                <li>• Forever Benefits</li>
                <li>• Permanent Status</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Who It's For */}
      <div className="relative z-10 px-6 lg:px-8 py-24 bg-white/5 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white sm:text-5xl mb-12">
            Who Root Membership Is For
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <div>
              <h3 className="text-2xl font-semibold text-white mb-6">Community Builders & Creators</h3>
              <ul className="space-y-4 text-white/80">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-yellow-400 mt-1 mr-3 flex-shrink-0" />
                  <span>Community organizers managing relationships across multiple life contexts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-yellow-400 mt-1 mr-3 flex-shrink-0" />
                  <span>Creators maintaining fan, collaborator, and business relationships</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-yellow-400 mt-1 mr-3 flex-shrink-0" />
                  <span>Activists organizing movements and coalition relationships</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-yellow-400 mt-1 mr-3 flex-shrink-0" />
                  <span>Parents managing family, school, and community connections</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-white mb-6">You're a Root Member if:</h3>
              <ul className="space-y-4 text-white/80">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-yellow-400 mt-1 mr-3 flex-shrink-0" />
                  <span>You believe all relationships matter, not just "networking"</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-yellow-400 mt-1 mr-3 flex-shrink-0" />
                  <span>You want to prevent relationship drift across all life contexts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-yellow-400 mt-1 mr-3 flex-shrink-0" />
                  <span>You value personal fulfillment and community impact over just business ROI</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-yellow-400 mt-1 mr-3 flex-shrink-0" />
                  <span>You want to be a better human, not just a better networker</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="relative z-10 px-6 lg:px-8 py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-white sm:text-5xl text-center mb-16">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">What happens to my Root Membership if Rhiz pivots or changes?</h3>
              <p className="text-white/70">Root Membership is platform-agnostic. You're investing in the relationship intelligence infrastructure we're building. Whatever Rhiz becomes, Root Members retain their foundational status.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Can I transfer or sell my Root Membership?</h3>
              <p className="text-white/70">Root Memberships are non-transferable. They're tied to your identity and relationship patterns, not just account access. This ensures the exclusivity and personal nature of the Root network.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">What if I don't use all 10 annual memberships?</h3>
              <p className="text-white/70">Your 10 annual memberships don't expire. You can distribute them over time as you identify the right people for your network. Think of them as strategic relationship investments, not use-it-or-lose-it credits.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">How is this different from just paying for Pro annually?</h3>
              <p className="text-white/70">Pro access is just one benefit. Root Membership includes exclusive features (Signal Mode, algorithm influence), permanent recognition, community proximity advantages, and future benefits that regular Pro users will never access.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">What happens after the first 100 spots are filled?</h3>
              <p className="text-white/70">Root Membership closes forever. Future users can only access Pro ($69/month) or Free tiers. The first 100 become the permanent foundation layer that influences how the entire relationship intelligence platform evolves.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Is there a refund policy?</h3>
              <p className="text-white/70">Given the exclusive and permanent nature of Root Membership, all sales are final. However, we're confident that the network effects and relationship intelligence will deliver exponential value from day one.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative z-10 px-6 lg:px-8 py-24 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white sm:text-5xl mb-8">
            Join the First 100
          </h2>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-12">
            <div className="text-6xl font-bold text-white mb-4">$999</div>
            <p className="text-xl text-white/80 mb-6">Lifetime access. 10 annual memberships included. Never available again.</p>
            <p className="text-white/60 italic">"Root is alignment. It's for those who believe that relationship management is spiritual infrastructure."</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 font-semibold px-8 py-4">
              Secure Your Root Membership
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
          
          <p className="text-white/60 text-sm">Only {remainingSpots} spots remaining of 100 total</p>
          
          <div className="mt-8 text-white/60 text-sm">
            <p>Questions? Email <a href="mailto:founders@rhiz.com" className="text-yellow-400 hover:text-yellow-300">founders@rhiz.com</a></p>
            <p>Root Members get direct access to the founding team.</p>
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

export default RootMembership; 