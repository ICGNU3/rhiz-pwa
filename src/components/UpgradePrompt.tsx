import React from 'react';
import Modal from './Modal';
import Button from './ui/Button';

interface UpgradePromptProps {
  open: boolean;
  onClose: () => void;
  type: 'contacts' | 'goals';
}

const LIMITS = {
  contacts: {
    title: 'Contact Limit Reached',
    message: 'Free tier users can add up to 25 contacts. Upgrade to Pro or Root for unlimited contacts and advanced features.'
  },
  goals: {
    title: 'Goal Limit Reached',
    message: 'Free tier users can add up to 3 goals. Upgrade to Pro or Root for unlimited goals and advanced features.'
  }
};

const UpgradePrompt: React.FC<UpgradePromptProps> = ({ open, onClose, type }) => {
  const { title, message } = LIMITS[type];
  return (
    <Modal isOpen={open} onClose={onClose} title={title}>
      <div className="p-6 text-center">
        <p className="mb-6 text-gray-700 dark:text-gray-300">{message}</p>
        <Button
          size="lg"
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          onClick={() => {
            window.location.href = '/pricing';
          }}
        >
          Upgrade Now
        </Button>
        <Button
          variant="outline"
          className="w-full mt-3"
          onClick={onClose}
        >
          Maybe Later
        </Button>
      </div>
    </Modal>
  );
};

export default UpgradePrompt; 