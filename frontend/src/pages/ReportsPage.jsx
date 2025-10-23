import React, { useState, useEffect, useMemo } from 'react';
import { Box, Container, Typography, Paper, Grid, useTheme, ToggleButtonGroup, ToggleButton, TextField, Button } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { getTransactions } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';
import { formatCurrency } from '../utils/currency.js';
import { generatePDFReport } from '../utils/pdfGenerator.js';

// Funções auxiliares de data
const getStartOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const getEndOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
const getStartOfLastMonth = (date) => new Date(date.getFullYear(), date.getMonth() - 1, 1);
const getEndOfLastMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 0, 23, 59, 59);
const formatDateForInput = (date) => {
  if (!date) return '';
  const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return adjustedDate.toISOString().split('T')[0];
};

// Função para processar dados
const processData = (transactions) => {
    if (!transactions || transactions.length === 0) { return { spendingData: [], incomeData: [], summary: { income: 0, expenses: 0, balance: 0 } }; }
    const spendingByCategory = transactions.filter(t => t.type === 'gasto').reduce((acc, t) => { const cat = t.category; const amt = Math.abs(t.amount); if (!acc[cat]) acc[cat] = 0; acc[cat] += amt; return acc; }, {});
    const incomeByCategory = transactions.filter(t => t.type === 'ganho').reduce((acc, t) => { const cat = t.category; const amt = t.amount; if (!acc[cat]) acc[cat] = 0; acc[cat] += amt; return acc; }, {});
    const spendingData = Object.keys(spendingByCategory).map(cat => ({ name: cat, value: spendingByCategory[cat] })).sort((a, b) => b.value - a.value);
    const incomeData = Object.keys(incomeByCategory).map(cat => ({ name: cat, value: incomeByCategory[cat] })).sort((a, b) => b.value - a.value);
    const income = transactions.filter(t => t.type === 'ganho').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'gasto').reduce((sum, t) => sum + t.amount, 0);
    return { spendingData, incomeData, summary: { income, expenses: Math.abs(expenses), balance: income + expenses } };
};

function ReportsPage() {
  const [allTransactions, setAllTransactions] = useState([]);
  const [startDate, setStartDate] = useState(getStartOfMonth(new Date()));
  const [endDate, setEndDate] = useState(new Date());
  const [quickFilter, setQuickFilter] = useState('thisMonth');
  const { user, logout } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    const fetchTransactionsData = async () => {
      if (user) {
        try { const response = await getTransactions(); setAllTransactions(response.data); }
        catch (error) { if (error.response && error.response.status === 401) logout(); }
      }
    };
    fetchTransactionsData();
  }, [user, logout]);

  const handleQuickFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setQuickFilter(newFilter);
      const now = new Date();
      if (newFilter === 'thisMonth') { setStartDate(getStartOfMonth(now)); setEndDate(now); }
      else if (newFilter === 'lastMonth') { setStartDate(getStartOfLastMonth(now)); setEndDate(getEndOfLastMonth(now)); }
      else if (newFilter === 'all') { setStartDate(null); setEndDate(null); }
    }
  };

  const handleDateChange = (type, value) => {
    setQuickFilter(null);
    if (type === 'start') { setStartDate(value ? new Date(value) : null); }
    else { setEndDate(value ? new Date(value) : null); }
  };

  const filteredTransactions = useMemo(() => {
    if (!startDate || !endDate) return allTransactions;
    const start = new Date(startDate); start.setHours(0, 0, 0, 0);
    const end = new Date(endDate); end.setHours(23, 59, 59, 999);
    return allTransactions.filter(t => { const d = new Date(t.date); return d >= start && d <= end; });
  }, [allTransactions, startDate, endDate]);

  const { spendingData, incomeData, summary } = useMemo(() => processData(filteredTransactions), [filteredTransactions]);

  // ✅✅✅ FUNÇÃO PARA GERAR O PDF ✅✅✅
  const handleExportPDF = () => {
    console.log("--- handleExportPDF chamada ---"); // Log de confirmação
    if (filteredTransactions && summary && user) {
        try {
            generatePDFReport(filteredTransactions, summary, startDate, endDate, user);
        } catch(pdfError) {
            console.error("Erro DENTRO da função generatePDFReport:", pdfError);
            alert("Erro ao tentar gerar PDF. Ver consola.");
        }
    } else {
        console.error("Faltam dados (transações, sumário ou utilizador) para gerar o PDF.");
        alert("Não há dados suficientes para gerar o PDF neste período.");
    }
  };

  const COLORS_SPENDING = ['#EF4444', '#F59E0B', '#F97316', '#8B5CF6', '#3B82F6'];
  const COLORS_INCOME = ['#00C2A8', '#22C55E', '#10B981', '#6EE7B7', '#A7F3D0'];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>Relatórios</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <ToggleButtonGroup value={quickFilter} exclusive onChange={handleQuickFilterChange} size="small">
            <ToggleButton value="thisMonth">Este Mês</ToggleButton>
            <ToggleButton value="lastMonth">Mês Passado</ToggleButton>
            <ToggleButton value="all">Tudo</ToggleButton>
          </ToggleButtonGroup>
          <TextField label="De" type="date" size="small" value={formatDateForInput(startDate)} onChange={(e) => handleDateChange('start', e.target.value)} InputLabelProps={{ shrink: true }} sx={{ width: 160 }} />
          <TextField label="Até" type="date" size="small" value={formatDateForInput(endDate)} onChange={(e) => handleDateChange('end', e.target.value)} InputLabelProps={{ shrink: true }} sx={{ width: 160 }} />
          
          {/* ✅✅✅ BOTÃO DE EXPORTAR COM A LIGAÇÃO onClick ✅✅✅ */}
          <Button
            variant="outlined"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleExportPDF} // Garante que chama a função correta
            disabled={!filteredTransactions || filteredTransactions.length === 0}
            size="small"
          >
            Exportar PDF
          </Button>
        </Box>
      </Box>

      {/* Cartões de Resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}><Paper sx={{ p: 2, textAlign: 'center' }}><Typography variant="subtitle1" color="text.secondary">Total de Ganhos</Typography><Typography variant="h5" sx={{ color: 'success.main', fontWeight: 'bold' }}>{formatCurrency(summary.income, user?.preferredCurrency)}</Typography></Paper></Grid>
        <Grid item xs={12} sm={4}><Paper sx={{ p: 2, textAlign: 'center' }}><Typography variant="subtitle1" color="text.secondary">Total de Gastos</Typography><Typography variant="h5" sx={{ color: 'error.main', fontWeight: 'bold' }}>{formatCurrency(summary.expenses, user?.preferredCurrency)}</Typography></Paper></Grid>
        <Grid item xs={12} sm={4}><Paper sx={{ p: 2, textAlign: 'center' }}><Typography variant="subtitle1" color="text.secondary">Saldo Final</Typography><Typography variant="h5" sx={{ fontWeight: 'bold', color: summary.balance >= 0 ? 'success.main' : 'error.main' }}>{formatCurrency(summary.balance, user?.preferredCurrency)}</Typography></Paper></Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>Distribuição de Gastos</Typography>
            {spendingData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={spendingData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={(entry) => entry.name}>
                    {spendingData.map((entry, index) => <Cell key={`cell-spend-${index}`} fill={COLORS_SPENDING[index % COLORS_SPENDING.length]} />)}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value, user?.preferredCurrency)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Typography>Sem dados de gastos no período.</Typography></Box>)}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>Origem dos Ganhos</Typography>
            {incomeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={incomeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={(entry) => entry.name}>
                    {incomeData.map((entry, index) => <Cell key={`cell-income-${index}`} fill={COLORS_INCOME[index % COLORS_INCOME.length]} />)}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value, user?.preferredCurrency)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Typography>Sem dados de ganhos no período.</Typography></Box>)}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ReportsPage;