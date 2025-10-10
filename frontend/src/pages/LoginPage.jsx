import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google'; // Um ícone para o botão
import { useAuth } from '../hooks/useAuth.js';
// Este é o endereço do nosso backend que inicia o processo de login com o Google
const GOOGLE_AUTH_URL = 'http://localhost:3001/api/auth/google';

function LoginPage() {
  return (
    <Container maxWidth="xs">
      <Box sx={{ 
        marginTop: 8, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <Typography component="h1" variant="h5">
          Aceder à App
        </Typography>
        <Typography sx={{ mt: 1, mb: 2, textAlign: 'center' }}>
          A forma mais segura e rápida de entrar, sem passwords.
        </Typography>
        
        {/* Este é o nosso novo botão de login */}
        <Button
          component="a" // Importante: Transforma o botão num link <a>
          href={GOOGLE_AUTH_URL} // O link aponta para a nossa API
          fullWidth
          variant="contained"
          startIcon={<GoogleIcon />}
          sx={{ mt: 3, mb: 2 }}
        >
          Entrar com o Google
        </Button>
      </Box>
    </Container>
  );
}

export default LoginPage;
