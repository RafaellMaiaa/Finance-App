import React, { useState, useEffect, useMemo } from 'react';
import { Box, Container, Typography, Paper, Grid, useTheme, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { getTransactions } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';

// Função auxiliar para processar os dados das transações
const processData = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return { spendingData: [], incomeData: [], summary: { income: 0, expenses: 0, balance: 0 } };
  }

  // Gastos por categoria
  const spendingByCategory = transactions
    .filter(t => t.type === 'gasto')
    .reduce((acc, transaction) => {
      const category = transaction.category;
      const amount = Math.abs(transaction.amount);
      if (!acc[category]) acc[category] = 0;
      acc[category] += amount;
      return acc;
    }, {});

  // Ganhos por categoria
  const incomeByCategory = transactions
    .filter(t => t.type === 'ganho')
    .reduce((acc, transaction) => {
      const category = transaction.category;
      const amount = transaction.amount;
      if (!acc[category]) acc[category] = 0;
      acc[category] += amount;
      return acc;
    }, {});

  const spendingData = Object.keys(spendingByCategory).map(category => ({
    name: category,
    value: spendingByCategory[category],
  })).sort((a, b) => b.value - a.value);

  const incomeData = Object.keys(incomeByCategory).map(category => ({
    name: category,
    value: incomeByCategory[category],
  })).sort((a, b) => b.value - a.value);

  const income = transactions.filter(t => t.type === 'ganho').reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'gasto').reduce((sum, t) => sum + t.amount, 0);

  return {
    spendingData,
    incomeData,
    summary: { income, expenses: Math.abs(expenses), balance: income + expenses },
  };
};

function ReportsPage() {
  const [allTransactions, setAllTransactions] = useState([]);
  const [filter, setFilter] = useState('thisMonth');
  const { user, logout } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    const fetchTransactionsData = async () => {
      if (user) {
        try {
          const response = await getTransactions();
          setAllTransactions(response.data);
        } catch (error) {
          if (error.response && error.response.status === 401) logout();
        }
      }
    };
    fetchTransactionsData();
  }, [user, logout]);

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) setFilter(newFilter);
  };

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    if (filter === 'thisMonth') {
      return allTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear();
      });
    }
    if (filter === 'lastMonth') {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return allTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === lastMonth.getMonth() && transactionDate.getFullYear() === lastMonth.getFullYear();
      });
    }
    return allTransactions;
  }, [allTransactions, filter]);

  const { spendingData, incomeData, summary } = useMemo(() => processData(filteredTransactions), [filteredTransactions]);

  const COLORS_SPENDING = ['#EF4444', '#F59E0B', '#F97316', '#FBBF24', '#FDBA74'];
  const COLORS_INCOME = ['#00C2A8', '#22C55E', '#10B981', '#38BDF8', '#818CF8'];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Relatórios
        </Typography>
        <ToggleButtonGroup value={filter} exclusive onChange={handleFilterChange}>
          <ToggleButton value="thisMonth">Este Mês</ToggleButton>
          <ToggleButton value="lastMonth">Mês Passado</ToggleButton>
          <ToggleButton value="all">Tudo</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Cartões de resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="subtitle1" color="text.secondary">Total de Ganhos</Typography>
            <Typography variant="h5" sx={{ color: 'success.main', fontWeight: 'bold' }}>{summary.income.toFixed(2).replace('.', ',')} €</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="subtitle1" color="text.secondary">Total de Gastos</Typography>
            <Typography variant="h5" sx={{ color: 'error.main', fontWeight: 'bold' }}>{summary.expenses.toFixed(2).replace('.', ',')} €</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="subtitle1" color="text.secondary">Saldo Final</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: summary.balance >= 0 ? 'success.main' : 'error.main' }}>
              {summary.balance.toFixed(2).replace('.', ',')} €
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3}>
        {/* Gráfico circular de gastos */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>Distribuição de Gastos</Typography>
            {spendingData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={spendingData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {spendingData.map((entry, index) => (
                      <Cell key={`cell-spending-${index}`} fill={COLORS_SPENDING[index % COLORS_SPENDING.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toFixed(2)} €`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Typography>Sem dados de gastos.</Typography></Box>)}
          </Paper>
        </Grid>
        {/* Gráfico circular de ganhos */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>Origem dos Ganhos</Typography>
            {incomeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={incomeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {incomeData.map((entry, index) => (
                      <Cell key={`cell-income-${index}`} fill={COLORS_INCOME[index % COLORS_INCOME.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toFixed(2)} €`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Typography>Sem dados de ganhos.</Typography></Box>)}
          </Paper>
        </Grid>
        {/* Gráfico de barras de gastos por categoria */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>Gastos por Categoria</Typography>
            {spendingData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendingData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" stroke={theme.palette.text.secondary} />
                  <YAxis dataKey="name" type="category" stroke={theme.palette.text.secondary} width={80} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                    contentStyle={{ backgroundColor: theme.palette.background.paper }}
                    formatter={(value) => `${value.toFixed(2)} €`}
                  />
                  <Bar dataKey="value" name="Gasto" fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            ) : (<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Typography>Sem dados de gastos.</Typography></Box>)}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ReportsPage;