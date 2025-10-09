import React from 'react';
import { Container, Typography } from '@mui/material';

function SettingsPage() {
  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, fontWeight: 'bold' }}>
        Definições da Conta
      </Typography>
      <Typography sx={{ mt: 2 }}>
        (Esta página está em construção)
      </Typography>
    </Container>
  );
}

export default SettingsPage;