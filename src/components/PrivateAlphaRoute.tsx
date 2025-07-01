
// Replace your PrivateAlphaRoute.tsx with this temporarily
import React from 'react';
import { Outlet } from 'react-router-dom';

const PrivateAlphaRoute: React.FC = () => {
  // TEMPORARY: Bypass all auth for development
  console.log('Development mode: bypassing auth');
  return <Outlet />;
};

export default PrivateAlphaRoute;