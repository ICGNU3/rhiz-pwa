import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ErrorBoundary from './components/common/ErrorBoundary';
import PageLoader from './components/common/PageLoader';
import PrivateAlphaRoute from './components/PrivateAlphaRoute';

// --- Lazy-loaded Pages ---
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Contacts = lazy(() => import('./pages/Contacts'));
const Network = lazy(() => import('./pages/Network'));
const Trust = lazy(() => import('./pages/Trust'));
const Settings = lazy(() => import('./pages/Settings'));

const ErrorFallback = () => (
  <div className="flex items-center justify-center h-screen bg-gray-900">
    <div className="p-8 text-center bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-red-500">Oops! Something went wrong.</h1>
      <p className="mt-2 text-gray-300">
        A part of the application failed to load. Please try refreshing the page.
      </p>
    </div>
  </div>
);const App: React.FC = () => {
  return (
    <BrowserRouter>      <ErrorBoundary fallback={<ErrorFallback />}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<PrivateAlphaRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/network" element={<Network />} />
              <Route path="/trust" element={<Trust />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import AppRouter from './router';
import LoadingScreen from './components/LoadingScreen';

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
      </div>
    </div>
  );
}

export default App;