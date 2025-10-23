import React, { useState } from 'react';
import {
  Box, Container, Typography, Paper, List, ListItem, ListItemText, ListItemIcon, 
  Divider, Switch, Select, MenuItem, FormControl
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useAuth } from '../hooks/useAuth.js';
import { updateUserProfile } from '../services/api.js';

function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [currency, setCurrency] = useState(user ? user.preferredCurrency : 'EUR');

  const handleCurrencyChange = async (event) => {
    const newCurrency = event.target.value;
    setCurrency(newCurrency);
    try {
      // Atualiza no backend e depois no nosso estado global (context)
      const res = await updateUserProfile({ preferredCurrency: newCurrency });
      updateUser(res.data);
    } catch (error) {
      console.error("Erro ao atualizar a moeda:", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
        Definições
      </Typography>

      <Paper>
        <List>
          {/* ... (outras definições) ... */}

          {/* ✅ SELETOR DE MOEDA ✅ */}
          <ListItem>
            <ListItemIcon>
              <CurrencyExchangeIcon />
            </ListItemIcon>
            <ListItemText
              primary="Moeda Principal"
              secondary="Os valores na aplicação serão convertidos para esta moeda."
            />
            <FormControl>
              <Select value={currency} onChange={handleCurrencyChange}>
                <MenuItem value="EUR">Euro (€)</MenuItem>
                <MenuItem value="USD">Dólar Americano ($)</MenuItem>
                <MenuItem value="GBP">Libra Esterlina (£)</MenuItem>
                <MenuItem value="BRL">Real Brasileiro (R$)</MenuItem>
              </Select>
            </FormControl>
          </ListItem>

          {/* ... (zona de perigo) ... */}
        </List>
      </Paper>
    </Container>
  );
}

export default SettingsPage;