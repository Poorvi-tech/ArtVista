import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Checking authentication...
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    // Store the attempted location so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific role is required and user doesn't have it
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#FF6A88', marginBottom: '20px' }}>Access Denied</h2>
        <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '30px' }}>
          You don't have permission to access this page.
        </p>
        <button 
          onClick={() => window.history.back()}
          style={{
            background: '#FF6A88',
            color: 'white',
            border: 'none',
            padding: '12px 25px',
            borderRadius: '30px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  // User is authenticated and has required permissions
  return children;
};

export default ProtectedRoute;