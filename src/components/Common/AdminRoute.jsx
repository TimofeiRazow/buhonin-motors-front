import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useAuth';
import LoadingSpinner from '../UI/LoadingSpinner/LoadingSpinner';

const AdminRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!user || user.user_type !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;