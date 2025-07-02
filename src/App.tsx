import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import AppRouter from './router';
import LoadingScreen from './components/LoadingScreen';
import PWAInstallPrompt from './components/PWAInstallPrompt';

function App() {
  const { theme } = useTheme();

  return (
    <div className={theme}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans font-light">
        <BrowserRouter>
          <Suspense fallback={<LoadingScreen />}>
            <AppRouter />
          </Suspense>
        </BrowserRouter>
        <PWAInstallPrompt />
      </div>
    </div>
  );
}

export default App;