import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Target, 
  Brain, 
  Network, 
  Shield, 
  Settings,
  Check,
  SkipForward
} from 'lucide-react';
import Button from './ui/Button';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  route?: string;
  selector?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
}

const OnboardingTour: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const overlayRef = useRef<HTMLDivElement>(null);

  const tourSteps: TourStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Rhiz!',
      description: 'Your intelligent relationship engine. Let\'s take a quick tour to get you started.',
      icon: Check,
      position: 'bottom'
    },
    {
      id: 'dashboard',
      title: 'Dashboard Overview',
      description: 'Your command center for relationship insights, recent activity, and quick actions.',
      icon: Users,
      route: '/app/dashboard',
      position: 'bottom'
    },
    {
      id: 'contacts',
      title: 'Manage Contacts',
      description: 'Store and organize your professional network with trust scores and relationship insights.',
      icon: Users,
      route: '/app/contacts',
      position: 'bottom'
    },
    {
      id: 'goals',
      title: 'Set Goals',
      description: 'Define relationship objectives and track your progress toward networking goals.',
      icon: Target,
      route: '/app/goals',
      position: 'bottom'
    },
    {
      id: 'intelligence',
      title: 'AI Assistant',
      description: 'Get intelligent insights and recommendations about your network and relationships.',
      icon: Brain,
      route: '/app/intelligence',
      position: 'bottom'
    },
    {
      id: 'network',
      title: 'Network Visualization',
      description: 'Visualize your connections and discover relationship patterns.',
      icon: Network,
      route: '/app/network',
      position: 'bottom'
    },
    {
      id: 'search',
      title: 'Global Search',
      description: 'Quickly find contacts, goals, and companies across your entire network.',
      icon: Check,
      selector: '[data-tour="search"]',
      position: 'bottom'
    },
    {
      id: 'settings',
      title: 'Customize Your Experience',
      description: 'Adjust notifications, privacy settings, and AI preferences to match your needs.',
      icon: Settings,
      route: '/app/settings',
      position: 'bottom'
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      description: 'You\'re ready to build stronger relationships with Rhiz. Start by adding your first contact!',
      icon: Check,
      position: 'bottom'
    }
  ];

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompleted = localStorage.getItem('rhiz-onboarding-completed');
    if (hasCompleted) {
      setIsCompleted(true);
      return;
    }

    // Show onboarding after a short delay for new users
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const currentStepData = tourSteps[currentStep];
    
    // Navigate to the required route if specified
    if (currentStepData.route && location.pathname !== currentStepData.route) {
      navigate(currentStepData.route);
    }

    // Highlight the target element if selector is provided
    if (currentStepData.selector) {
      const element = document.querySelector(currentStepData.selector);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStep, isVisible, navigate, location.pathname]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    completeTour();
  };

  const completeTour = () => {
    setIsVisible(false);
    setIsCompleted(true);
    localStorage.setItem('rhiz-onboarding-completed', 'true');
    
    // Track completion
    if ((window as any).gtag) {
      (window as any).gtag('event', 'onboarding_completed', {
        event_category: 'engagement',
        event_label: 'user_onboarding'
      });
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      handleSkip();
    }
  };

  if (isCompleted || !isVisible) {
    return null;
  }

  const currentStepData = tourSteps[currentStep];
  const Icon = currentStepData.icon;
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span>Step {currentStep + 1} of {tourSteps.length}</span>
            <button
              onClick={handleSkip}
              className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              <SkipForward className="w-4 h-4" />
              <span>Skip</span>
            </button>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {currentStepData.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {currentStepData.description}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentStep === 0}
            icon={ChevronLeft}
          >
            Previous
          </Button>

          <Button
            onClick={handleNext}
            className="flex-1 ml-3"
            icon={currentStep === tourSteps.length - 1 ? Check : ChevronRight}
          >
            {currentStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center space-x-2 mt-6">
          {tourSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep 
                  ? 'bg-indigo-600' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour; 