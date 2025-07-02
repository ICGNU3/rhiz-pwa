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