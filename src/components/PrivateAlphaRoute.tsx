

import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from './Layout';

const PrivateAlphaRoute: React.FC = () => {
  // For alpha, we assume the user is authenticated.
  const isAuthenticated = true; 

  // This route's purpose is to protect child routes and provide the common UI Layout.
  // The <Layout> component contains an <Outlet> for the child routes to render into.
  return isAuthenticated ? <Layout /> : <Navigate to="/login" />;
};

export default PrivateAlphaRoute;