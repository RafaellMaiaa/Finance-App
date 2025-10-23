import React from 'react';
import { Container, Box, Typography, Button, Paper, Avatar } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
// ✅ A linha de importação do logo foi REMOVIDA daqui

const GOOGLE_AUTH_URL = 'http://localhost:3001/api/auth/google';

function LoginPage() {
  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 4,
      }}>
        {/* Logótipo */}
        <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
          {/* ✅ O caminho da imagem foi ATUALIZADO para usar a pasta 'public' */}
          <img src="/images/Logo.png" alt="Finance Flow Icon" style={{ width: '70%', height: '60%' }} />
        </Avatar>

        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
          Bem-vindo ao Finance Flow
        </Typography>
        
        <Typography sx={{ mt: 2, mb: 3, textAlign: 'center', color: 'text.secondary' }}>
          Aceda de forma segura com a sua conta Google para gerir as suas finanças pessoais.
        </Typography>
        
        <Button
          component="a"
          href={GOOGLE_AUTH_URL}
          fullWidth
          variant="contained"
          startIcon={<GoogleIcon />}
          sx={{ mb: 2 }}
        >
          Entrar com o Google
        </Button>

        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
          {'Precisa de ajuda? '}
          <a href="#" style={{ color: 'inherit' }}>
            Contacte o suporte
          </a>
        </Typography>
      </Paper>
    </Container>
  );
}

export default LoginPage;