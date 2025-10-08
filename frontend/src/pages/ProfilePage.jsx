import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material';
import { useAuth } from '../hooks/useAuth.js';
import { updateUserProfile } from '../services/api.js';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user ? user.name : '');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateUserProfile({ name });
      updateUser(res.data);
      setMessage('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar o perfil:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Editar Perfil
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Endereço de Email"
            name="email"
            value={user ? user.email : ''}
            disabled
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nome"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Guardar Alterações
          </Button>
          {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
        </Box>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Voltar ao Painel
        </Button>
      </Box>
    </Container>
  );
}

export default ProfilePage;