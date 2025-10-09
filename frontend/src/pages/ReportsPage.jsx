import React, { useState, useEffect, useMemo } from 'react';
import { Box, Container, Typography, Paper, Grid, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getTransactions } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';

// Função auxiliar para processar e agregar os dados das transações
const processDataForChart = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return { spendingData: [], summary: { income: 0, expenses: 0, balance: 0 } };
  }

  // Agrega os gastos por categoria
  const spendingByCategory = transactions
    .filter(t => t.type === 'gasto')
    .reduce((acc, transaction) => {
      const category = transaction.category;
      const amount = Math.abs(transaction.amount);
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += amount;
      return acc;
    }, {});

  // Transforma o objeto num array para o gráfico
  const spendingData = Object.keys(spendingByCategory).map(category => ({
    name: category,
    Gasto: spendingByCategory[category],
  })).sort((a, b) => b.Gasto - a.Gasto); // Ordena do maior para o menor

  // Calcula os totais
  const income = transactions
    .filter(t => t.type === 'ganho')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.type === 'gasto')
    .reduce((sum, t) => sum + t.amount, 0);

  const summary = {
    income,
    expenses: Math.abs(expenses), // Apresentar como número positivo
    balance: income + expenses,
  };
  
  return { spendingData, summary };
};

function ReportsPage() {
  const [data, setData] = useState({ spendingData: [], summary: { income: 0, expenses: 0, balance: 0 } });
  const { user, logout } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    const fetchAndProcessData = async () => {
      if (user) {
        try {
          const response = await getTransactions();
          const processedData = processDataForChart(response.data);
          setData(processedData);
        } catch (error) {
          if (error.response && error.response.status === 401) logout();
        }
      }
    };
    fetchAndProcessData();
  }, [user, logout]);
  
  const { spendingData, summary } = data;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Relatórios
      </Typography>

      {/* SECÇÃO DOS CARTÕES DE RESUMO */}
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

      {/* SECÇÃO DO GRÁFICO */}
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Gastos por Categoria
        </Typography>
        {spendingData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={spendingData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
              <YAxis stroke={theme.palette.text.secondary} />
              <Tooltip
                contentStyle={{ backgroundColor: theme.palette.background.paper, border: '1px solid #555' }}
                formatter={(value) => `${value.toFixed(2)} €`}
              />
              <Legend />
              <Bar dataKey="Gasto" fill={theme.palette.primary.main} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography>Não há dados de gastos suficientes para mostrar o gráfico.</Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default ReportsPage;