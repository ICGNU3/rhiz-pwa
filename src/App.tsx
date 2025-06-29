import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import AppRouter from './router';

function App() {
  const { theme } = useTheme();

  return (
    <div className={theme}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;