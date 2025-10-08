import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyLoginToken } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

function VerifyLoginPage() {
  const [message, setMessage] = useState('A verificar o seu link de acesso...');
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    
    if (token) {
      const verify = async () => {
        try {
          const response = await verifyLoginToken(token);
          login(response.data.token); // Guarda o token de sessão e atualiza o estado
          navigate('/'); // Redireciona para o painel principal
        } catch (error) {
          setMessage('Link inválido ou expirado. Por favor, tente pedir um novo link.');
        }
      };
      verify();
    } else {
      setMessage('Token não encontrado na URL. Por favor, use o link enviado para o seu email.');
    }
  }, [location, login, navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <CircularProgress sx={{ mb: 2 }} />
      <Typography>{message}</Typography>
    </Box>
  );
}
export default VerifyLoginPage;