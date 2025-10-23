import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Paper, List, ListItem, ListItemText, IconButton,
  Grid, TextField, Button, Select, MenuItem, InputLabel, FormControl, RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../hooks/useAuth.js';
import { useSnackbar } from '../context/SnackbarContext.jsx';
import { getCategories, getRecurringTransactions, createRecurringTransaction, deleteRecurringTransaction } from '../services/api.js';
import { formatCurrency } from '../utils/currency.js';

function RecurringPage() {
  const [recurring, setRecurring] = useState([]);
  const [categories, setCategories] = useState([]);
  // Estados para o formulário
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('gasto');
  const [category, setCategory] = useState('');
  const [dayOfMonth, setDayOfMonth] = useState(1);
  
  const { user, logout } = useAuth();
  const showSnackbar = useSnackbar();

  const fetchRecurring = async () => {
    try {
      const [recRes, catRes] = await Promise.all([getRecurringTransactions(), getCategories()]);
      setRecurring(recRes.data);
      setCategories(catRes.data);
    } catch (error) {
      if (error.response?.status === 401) logout();
    }
  };

  useEffect(() => {
    if (user) fetchRecurring();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRecurringTransaction({ description, amount, type, category, dayOfMonth });
      showSnackbar('Modelo recorrente criado com sucesso!', 'success');
      // Limpar formulário
      setDescription(''); setAmount(''); setType('gasto'); setCategory(''); setDayOfMonth(1);
      fetchRecurring(); // Atualizar lista
    } catch (error) {
      showSnackbar('Erro ao criar modelo.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem a certeza que quer apagar este modelo recorrente?')) {
      try {
        await deleteRecurringTransaction(id);
        showSnackbar('Modelo apagado com sucesso.', 'info');
        fetchRecurring();
      } catch (error) {
        showSnackbar('Erro ao apagar modelo.', 'error');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
        Gerir Transações Recorrentes
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          {/* Formulário para criar novos modelos */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Criar Novo Modelo</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} required />
              <TextField label="Montante" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              <FormControl>
                <RadioGroup row value={type} onChange={(e) => setType(e.target.value)}>
                  <FormControlLabel value="gasto" control={<Radio />} label="Gasto" />
                  <FormControlLabel value="ganho" control={<Radio />} label="Ganho" />
                </RadioGroup>
              </FormControl>
              <FormControl fullWidth required>
                <InputLabel>Categoria</InputLabel>
                <Select value={category} label="Categoria" onChange={(e) => setCategory(e.target.value)}>
                  {categories.map((cat) => <MenuItem key={cat._id} value={cat.name}>{cat.name}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField label="Dia do Mês para Gerar" type="number" inputProps={{ min: 1, max: 31 }} value={dayOfMonth} onChange={(e) => setDayOfMonth(e.target.value)} required />
              <Button type="submit" variant="contained">Criar Modelo</Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={7}>
          {/* Lista de modelos existentes */}
          <Paper>
            <List>
              {recurring.map((item) => (
                <ListItem key={item._id} divider secondaryAction={<IconButton edge="end" onClick={() => handleDelete(item._id)}><DeleteIcon /></IconButton>}>
                  <ListItemText
                    primary={item.description}
                    secondary={`Dia ${item.dayOfMonth} de cada mês`}
                  />
                  <Typography sx={{ fontWeight: 'bold', color: item.type === 'ganho' ? 'success.main' : 'error.main' }}>
                    {formatCurrency(item.amount, user?.preferredCurrency)}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default RecurringPage;