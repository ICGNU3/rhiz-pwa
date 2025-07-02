
// Replace your PrivateAlphaRoute.tsx with this temporarily
import React from 'react';
import { Outlet } from 'react-router-dom';


const PrivateAlphaRoute: React.FC = () => {
  // TEMPORARY: In development, this route bypasses auth checks.
  return <Outlet />;
};

export default PrivateAlphaRoute;