import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Container, Typography, Paper, List, ListItem, ListItemText, TextField,
  InputAdornment, LinearProgress, Grid, IconButton, Tooltip, CircularProgress
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useAuth } from '../hooks/useAuth.js';
import { getCategories, getTransactions, getBudgets, setBudget } from '../services/api.js';
import { formatCurrency } from '../utils/currency.js';

function BudgetsPage() {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const [categoriesRes, transactionsRes, budgetsRes] = await Promise.all([
          getCategories(),
          getTransactions(),
          getBudgets(currentMonth, currentYear)
        ]);

        setCategories(categoriesRes.data || []);
        setTransactions(transactionsRes.data || []);

        const budgetsMap = (budgetsRes.data || []).reduce((acc, budget) => {
          acc[budget.category] = budget.amount;
          return acc;
        }, {});
        setBudgets(budgetsMap);
        setInputs(budgetsMap);
      } catch (error) {
        if (error?.response?.status === 401) logout();
        else console.error('Erro ao carregar dados de orçamentos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, logout, currentMonth, currentYear]);

  // Calcula os gastos atuais por categoria
  const spendingByCategory = useMemo(() => {
    return (transactions || [])
      .filter(t => t.type === 'gasto')
      .reduce((acc, t) => {
        const amount = Math.abs(Number(t.amount) || 0);
        if (!acc[t.category]) acc[t.category] = 0;
        acc[t.category] += amount;
        return acc;
      }, {});
  }, [transactions]);

  const handleInputChange = (categoryName, value) => {
    setInputs(prev => ({ ...prev, [categoryName]: value }));
  };

  const handleSetBudget = async (categoryName) => {
    const raw = inputs[categoryName];
    const amount = Number(raw === '' || raw == null ? 0 : parseFloat(raw));
    try {
      await setBudget({ category: categoryName, amount, month: currentMonth, year: currentYear });
      setBudgets(prev => ({ ...prev, [categoryName]: amount }));
      setInputs(prev => ({ ...prev, [categoryName]: amount }));
    } catch (error) {
      console.error("Erro ao definir orçamento:", error);
    }
  };

  // Mostra todas as categorias que o utilizador criou
  const relevantCategories = categories || [];

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
        Orçamentos para {new Date(currentYear, currentMonth - 1).toLocaleString('pt-PT', { month: 'long' })} {currentYear}
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : (
        <Paper>
          <List>
            {relevantCategories.length > 0 ? relevantCategories.map(category => {
              const spent = spendingByCategory[category.name] || 0;
              const budget = budgets[category.name] || 0;
              const progress = budget > 0 ? (spent / budget) * 100 : 0;
              const isOverBudget = spent > budget && budget > 0;

              return (
                <ListItem key={category._id} divider>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={3}>
                      <ListItemText primary={category.name} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            {formatCurrency(spent, user?.preferredCurrency)} gastos
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {budget > 0 ? `de ${formatCurrency(budget, user?.preferredCurrency)}` : 'Sem orçamento'}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(progress, 100)}
                          color={isOverBudget ? 'error' : 'primary'}
                          sx={{ height: 10, borderRadius: 5 }}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Definir Limite"
                        type="number"
                        size="small"
                        value={inputs[category.name] ?? ''}
                        onChange={(e) => handleInputChange(category.name, e.target.value)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">€</InputAdornment>,
                          endAdornment: (
                            <InputAdornment position="end">
                              <Tooltip title="Guardar Orçamento">
                                <IconButton aria-label={`guardar-orcamento-${category.name}`} onClick={() => handleSetBudget(category.name)} edge="end">
                                  <SaveIcon />
                                </IconButton>
                              </Tooltip>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </ListItem>
              );
            }) : (
              <Typography sx={{ textAlign: 'center', p: 4, color: 'text.secondary' }}>
                Primeiro, crie algumas categorias na página "Gerir Categorias".
              </Typography>
            )}
          </List>
        </Paper>
      )}
    </Container>
  );
}

export default BudgetsPage;