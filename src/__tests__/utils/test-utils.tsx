import React from 'react';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';

const AllProviders: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <AuthProvider>
    <ThemeProvider>
      {children}
    </ThemeProvider>
  </AuthProvider>
);

const customRender = (ui: React.ReactElement, options?: Parameters<typeof render>[1]) =>
  render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
