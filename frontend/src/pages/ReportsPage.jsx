import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Container, Typography, Paper, Grid, useTheme,
  ToggleButtonGroup, ToggleButton, TextField
} from '@mui/material';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { getTransactions } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';
import { formatCurrency } from '../utils/currency.js';

// Funções auxiliares para trabalhar com datas
const getStartOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const getEndOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
const getStartOfLastMonth = (date) => new Date(date.getFullYear(), date.getMonth() - 1, 1);
const getEndOfLastMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 0, 23, 59, 59);

// Função para processar dados das transações
const processData = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return { spendingData: [], incomeData: [], summary: { income: 0, expenses: 0, balance: 0 } };
  }

  const spendingByCategory = transactions
    .filter(t => t.type === 'gasto')
    .reduce((acc, transaction) => {
      const category = transaction.category || 'Sem Categoria';
      const amount = Math.abs(Number(transaction.amount) || 0);
      if (!acc[category]) acc[category] = 0;
      acc[category] += amount;
      return acc;
    }, {});

  const incomeByCategory = transactions
    .filter(t => t.type === 'ganho')
    .reduce((acc, transaction) => {
      const category = transaction.category || 'Sem Categoria';
      const amount = Number(transaction.amount) || 0;
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

  const income = transactions.filter(t => t.type === 'ganho').reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const expenses = transactions.filter(t => t.type === 'gasto').reduce((sum, t) => sum + Number(t.amount || 0), 0);

  return {
    spendingData,
    incomeData,
    summary: { income, expenses: Math.abs(expenses), balance: income + expenses },
  };
};

function ReportsPage() {
  const [allTransactions, setAllTransactions] = useState([]);
  const [quickFilter, setQuickFilter] = useState('thisMonth');
  const [startDate, setStartDate] = useState(getStartOfMonth(new Date()));
  const [endDate, setEndDate] = useState(new Date());

  const { user, logout } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    const fetchTransactionsData = async () => {
      if (!user) return;
      try {
        const response = await getTransactions();
        setAllTransactions(response.data || []);
      } catch (error) {
        if (error?.response?.status === 401) logout();
        else console.error('Erro ao obter transações:', error);
      }
    };
    fetchTransactionsData();
  }, [user, logout]);

  // Lida com os botões de filtro rápido (este mês, mês passado, tudo)
  const handleQuickFilter = (event, newFilter) => {
    if (newFilter === null) return;
    const now = new Date();
    setQuickFilter(newFilter);
    if (newFilter === 'thisMonth') {
      setStartDate(getStartOfMonth(now));
      setEndDate(now);
    } else if (newFilter === 'lastMonth') {
      setStartDate(getStartOfLastMonth(now));
      setEndDate(getEndOfLastMonth(now));
    } else if (newFilter === 'all') {
      setStartDate(null);
      setEndDate(null);
    }
  };

  // Filtra transações pelo intervalo de datas selecionado
  const filteredTransactions = useMemo(() => {
    if (!startDate || !endDate) return allTransactions;
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return (allTransactions || []).filter(t => {
      const txDate = new Date(t.date);
      return txDate >= start && txDate <= end;
    });
  }, [allTransactions, startDate, endDate]);

  const { spendingData, incomeData, summary } = useMemo(() => processData(filteredTransactions), [filteredTransactions]);

  const COLORS_SPENDING = ['#EF4444', '#F59E0B', '#F97316', '#FBBF24', '#FDBA74'];
  const COLORS_INCOME = ['#00C2A8', '#22C55E', '#10B981', '#38BDF8', '#818CF8'];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>Relatórios</Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <ToggleButtonGroup value={quickFilter} exclusive onChange={handleQuickFilter} size="small">
            <ToggleButton value="thisMonth">Este Mês</ToggleButton>
            <ToggleButton value="lastMonth">Mês Passado</ToggleButton>
            <ToggleButton value="all">Tudo</ToggleButton>
          </ToggleButtonGroup>

          <TextField
            label="De"
            type="date"
            size="small"
            value={startDate ? new Date(startDate).toISOString().split('T')[0] : ''}
            onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Até"
            type="date"
            size="small"
            value={endDate ? new Date(endDate).toISOString().split('T')[0] : ''}
            onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </Box>

      {/* Cartões de resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="subtitle1" color="text.secondary">Total de Ganhos</Typography>
            <Typography variant="h5" sx={{ color: 'success.main', fontWeight: 'bold' }}>
              {formatCurrency(summary.income, user?.preferredCurrency)}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="subtitle1" color="text.secondary">Total de Gastos</Typography>
            <Typography variant="h5" sx={{ color: 'error.main', fontWeight: 'bold' }}>
              {formatCurrency(summary.expenses, user?.preferredCurrency)}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="subtitle1" color="text.secondary">Saldo Final</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: summary.balance >= 0 ? 'success.main' : 'error.main' }}>
              {formatCurrency(summary.balance, user?.preferredCurrency)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3}>
        {/* Pie - Gastos */}
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
                  <Tooltip formatter={(value) => formatCurrency(value, user?.preferredCurrency)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography>Sem dados de gastos.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Pie - Ganhos */}
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
                  <Tooltip formatter={(value) => formatCurrency(value, user?.preferredCurrency)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography>Sem dados de ganhos.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Bar - Gastos por categoria */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>Gastos por Categoria</Typography>
            {spendingData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendingData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" stroke={theme.palette.text.secondary} />
                  <YAxis dataKey="name" type="category" stroke={theme.palette.text.secondary} width={120} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                    contentStyle={{ backgroundColor: theme.palette.background.paper }}
                    formatter={(value) => formatCurrency(value, user?.preferredCurrency)}
                  />
                  <Bar dataKey="value" name="Gasto" fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography>Sem dados de gastos.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ReportsPage;