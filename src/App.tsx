import React, { Suspense, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import { useNotifications, createNotification } from './context/NotificationContext';
import AppRouter from './router';
import LoadingScreen from './components/LoadingScreen';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import OnboardingTour from './components/OnboardingTour';
import { demoContacts } from './data/demoData';
import { getAtRiskContacts } from './utils/relationshipHealth';

function App() {
  const { theme } = useTheme();
  const { addNotification } = useNotifications();

  // Add demo notifications for testing
  useEffect(() => {
    const timer = setTimeout(() => {
      addNotification(createNotification.success(
        'Welcome to Rhiz!',
        'Your intelligent relationship engine is ready to help you build stronger connections.',
        'system'
      ));

      // Smart Reminders: At-risk contacts
      const atRisk = getAtRiskContacts(demoContacts, 30);
      atRisk.forEach(contact => {
        addNotification({
          type: 'warning',
          title: `Reach out to ${contact.name}?`,
          message: `It's been over 30 days since you last connected with ${contact.name}.`,
          category: 'contact',
          action: {
            label: 'Send Message',
            onClick: () => {
              window.open(`mailto:${contact.email || ''}?subject=Checking in&body=Hi ${contact.name},`);
            }
          },
          metadata: { contactId: contact.id }
        });
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [addNotification]);

  return (
    <div className={theme}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans font-light">
        <BrowserRouter>
          <Suspense fallback={<LoadingScreen />}>
            <AppRouter />
          </Suspense>
          <PWAInstallPrompt />
          <OnboardingTour />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;