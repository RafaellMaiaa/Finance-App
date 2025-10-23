import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { checkRecurringNotifications } from '../services/api.js'; // 1. Importar a função
import { Box, CircularProgress, Typography } from '@mui/material';
import { useSnackbar } from '../context/SnackbarContext.jsx'; // Para feedback opcional

function VerifyLoginPage() {
  const [message, setMessage] = useState('A verificar o seu link de acesso...');
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar(); // Para mostrar resultado (opcional)

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    
    if (token) {
      const completeLoginAndCheckNotifications = async () => {
        try {
          // 2. Guarda o token de sessão (login)
          login(token); 
          setMessage('Login bem-sucedido! A verificar lembretes...');

          // 3. ✅ ACIONA A VERIFICAÇÃO AUTOMÁTICA EM SEGUNDO PLANO ✅
          try {
             const notifyResponse = await checkRecurringNotifications();
             console.log("Verificação automática de lembretes:", notifyResponse.data.message);
             // Opcional: Mostrar uma notificação discreta se houver lembretes enviados
             if (notifyResponse.data.message && notifyResponse.data.message.startsWith('1') || notifyResponse.data.message.startsWith('2') || notifyResponse.data.message.startsWith('3')) {
                showSnackbar(notifyResponse.data.message, 'info');
             }
          } catch (notifyError) {
             console.error("Erro na verificação automática de lembretes:", notifyError);
             // Não paramos o login por causa disto
          }
          
          // 4. Redireciona para o painel principal
          navigate('/');

        } catch (error) {
           // Este catch é para erros no 'login' ou 'getUserProfile' dentro do login
           setMessage('Erro ao completar o login. Tente novamente.');
           // Talvez redirecionar para /login depois de um tempo
        }
      };
      completeLoginAndCheckNotifications();
    } else {
      setMessage('Token não encontrado na URL. Por favor, use o link enviado para o seu email.');
      // Redirecionar para /login depois de um tempo
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [location, login, navigate, showSnackbar]); // Adicionar showSnackbar às dependências

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <CircularProgress sx={{ mb: 2 }} />
      <Typography>{message}</Typography>
    </Box>
  );
}

export default VerifyLoginPage;