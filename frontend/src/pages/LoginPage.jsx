import React, { useState } from 'react';
import { requestLoginLink } from '../services/api';
import { Container, Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      await requestLoginLink(email);
      setMessage('Link de acesso enviado! Por favor, verifique o seu email (incluindo a pasta de spam).');
    } catch (err) {
      setError('Ocorreu um erro ao enviar o link. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Aceder à App</Typography>
        <Typography sx={{ mt: 1, mb: 2, textAlign: 'center' }}>Insira o seu email para receber um link de acesso mágico, sem necessidade de password.</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Endereço de Email"
            name="email"
            type="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Receber Link de Acesso'}
          </Button>
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </Box>
    </Container>
  );
}
export default LoginPage;