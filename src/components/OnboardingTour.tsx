import React, { useState } from 'react';
import Modal from './Modal';
import Button from './ui/Button';

interface OnboardingTourProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
  isFreeTier?: boolean;
}

const steps = [
  {
    title: 'Welcome to Rhiz!',
    content: "Let's get you set up to strengthen your circle and unlock the power of intelligent relationship management."
  },
  {
    title: 'Set Up Your Profile',
    content: 'Add your name, bio, and preferences so your network knows who you are.'
  },
  {
    title: 'Connect Integrations',
    content: 'Sync your contacts from Google, LinkedIn, X (Twitter), and more to get started quickly.'
  },
  {
    title: 'Add Your First Contact',
    content: 'Start building your network by adding someone you know and trust.'
  },
  // AI Key step will be conditionally included
  {
    title: 'Bring Your Own AI Key',
    content: 'Free tier users: Add your OpenAI/Anthropic API key to use AI features.'
  },
  {
    title: 'Upgrade for More',
    content: 'Upgrade to Pro or Root for unlimited contacts, goals, and advanced AI features.'
  }
];

const OnboardingTour: React.FC<OnboardingTourProps> = ({ open, onClose, onComplete, isFreeTier }) => {
  // Filter steps based on tier
  const filteredSteps = isFreeTier ? steps : steps.filter((s, i) => i !== 4);
  const [step, setStep] = useState(0);
  const isLast = step === filteredSteps.length - 1;
  const isFirst = step === 0;
  return (
    <Modal isOpen={open} onClose={onClose} title={filteredSteps[step].title}>
      <div className="p-6 text-center">
        <p className="mb-6 text-gray-700 dark:text-gray-300">{filteredSteps[step].content}</p>
        <div className="flex justify-between gap-4 mt-6">
          <Button
            variant="outline"
            disabled={isFirst}
            onClick={() => setStep(s => Math.max(0, s - 1))}
          >
            Back
          </Button>
          {!isLast ? (
            <Button
              onClick={() => setStep(s => Math.min(filteredSteps.length - 1, s + 1))}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={() => {
                onComplete();
                onClose();
              }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
            >
              Finish
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default OnboardingTour; 