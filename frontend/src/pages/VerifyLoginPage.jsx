import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { Box, CircularProgress, Typography } from '@mui/material';

function VerifyLoginPage() {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');

    if (token) {
      login(token);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [location, login, navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <CircularProgress sx={{ mb: 2 }} />
      <Typography>A finalizar a sua sessão...</Typography>
    </Box>
  );
}

export default VerifyLoginPage;