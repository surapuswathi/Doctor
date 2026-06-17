import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="container py-5 mt-5">
        <Spinner size="lg" message="Authenticating session..." />
      </div>
    );
  }

  // If there is no token or no user, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // If user role is not authorized, redirect to home page
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn(`User role '${user.role}' is not allowed to view this route.`);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
