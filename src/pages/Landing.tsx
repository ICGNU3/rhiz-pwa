import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import LivePreviewSection from '../components/landing/LivePreviewSection';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-aqua to-lavender font-sans font-light">
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
          </div>
        </div>
      </div>

      {/* Live Preview Section: Visualizations and animated previews */}
      <div className="relative z-10">
        <LivePreviewSection />
      </div>

      {/* Add any additional landing sections here, such as testimonials, feature highlights, or call-to-action banners, as previously present. */}
    </div>
  );
};

export default Landing;