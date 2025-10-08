import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Box, CircularProgress } from '@mui/material';

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;