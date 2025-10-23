import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Paper, List, ListItem, ListItemText, IconButton,
  Grid, TextField, Button, Select, MenuItem, InputLabel, FormControl, RadioGroup, FormControlLabel, Radio, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import { useAuth } from '../hooks/useAuth.js';
import { useSnackbar } from '../context/SnackbarContext.jsx';
import { getCategories, getRecurringTransactions, createRecurringTransaction, deleteRecurringTransaction, checkRecurringNotifications } from '../services/api.js';
import { formatCurrency } from '../utils/currency.js';

function RecurringPage() {
  const [recurring, setRecurring] = useState([]);
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [type, setType] = useState('gasto');
  const [category, setCategory] = useState('');
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, logout } = useAuth();
  const { showSnackbar } = useSnackbar();

  // Função para ir buscar os dados
  const fetchRecurring = async () => {
    try {
      const [recRes, catRes] = await Promise.all([getRecurringTransactions(), getCategories()]);
      setRecurring(recRes.data || []);
      if (categories.length === 0) {
        setCategories(catRes.data || []);
      }
    } catch (error) {
      if (error.response?.status === 401) logout();
      console.error("Erro ao obter dados recorrentes:", error);
    }
  };

  useEffect(() => {
    if (user) fetchRecurring();
  }, [user]);

  // Função para criar um novo modelo (com atualização otimista)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amountInput || !category || !dayOfMonth) {
      showSnackbar('Preencha todos os campos obrigatórios.', 'warning'); return;
    }
    const amount = parseFloat(String(amountInput).replace(',', '.'));
    if (isNaN(amount) || amount <= 0) {
      showSnackbar('Montante inválido.', 'warning'); return;
    }

    setIsSubmitting(true);

    try {
      const response = await createRecurringTransaction({ description: description.trim(), amount, type, category, dayOfMonth: Number(dayOfMonth) });
      const createdRecurring = response.data;

      // Atualização otimista: adiciona o item retornado pelo backend
      setRecurring(prev => {
        const next = [...prev, createdRecurring];
        return next.sort((a, b) => a.description.localeCompare(b.description));
      });

      showSnackbar('Modelo recorrente criado!', 'success');
      setDescription(''); setAmountInput(''); setType('gasto'); setCategory(''); setDayOfMonth(1);
      // opcional: await fetchRecurring();
    } catch (error) {
      console.error("Erro ao criar modelo recorrente:", error);
      showSnackbar('Erro ao criar modelo.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para apagar um modelo (com atualização otimista)
  const handleDelete = async (id) => {
    if (!window.confirm('Tem a certeza?')) return;
    // Remover otimisticamente
    const previous = recurring;
    setRecurring(prev => prev.filter(item => item._id !== id));

    try {
      await deleteRecurringTransaction(id);
      showSnackbar('Modelo apagado.', 'info');
      // opcional: await fetchRecurring();
    } catch (error) {
      console.error("Erro ao apagar modelo recorrente:", error);
      showSnackbar('Erro ao apagar modelo.', 'error');
      // Reverter em caso de erro
      setRecurring(previous);
    }
  };

  // Função para verificar lembretes
  const handleCheckNotifications = async () => {
    setIsChecking(true);
    try {
      const response = await checkRecurringNotifications();
      showSnackbar(response?.data?.message || 'Verificação concluída.', 'success');
      // atualizar templates caso tenham sido marcados como notificados
      await fetchRecurring();
    } catch (error) {
      console.error('Erro ao verificar lembretes recorrentes:', error);
      showSnackbar('Erro ao verificar lembretes.', 'error');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Gerir Transações Recorrentes
        </Typography>
        <Button
          variant="outlined"
          startIcon={isChecking ? <CircularProgress size={20} /> : <NotificationImportantIcon />}
          onClick={handleCheckNotifications}
          disabled={isChecking}
        >
          Verificar Lembretes do Mês
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Criar Novo Modelo</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <TextField
                label="Montante"
                type="text"
                inputMode="decimal"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                required
              />
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
              <TextField
                label="Dia do Mês para Gerar"
                type="number"
                inputProps={{ min: 1, max: 31 }}
                value={dayOfMonth}
                onChange={(e) => setDayOfMonth(Math.max(1, Math.min(31, Number(e.target.value || 1))))}
                required
              />
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? <CircularProgress size={20} /> : 'Criar Modelo'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper>
            <List>
              {recurring.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">Ainda não criou nenhum modelo de transação recorrente.</Typography>
                </Box>
              ) : recurring.map((item) => (
                <ListItem
                  key={item._id}
                  divider
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleDelete(item._id)} aria-label={`delete-${item._id}`}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={item.description}
                    secondary={`Dia ${item.dayOfMonth} de cada mês • ${item.category}`}
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