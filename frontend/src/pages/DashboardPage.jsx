import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Grid, Paper, Button
} from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import Chat from '../components/Chat.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import TransactionList from '../components/TransactionList.jsx';
import { getTransactions, addTransaction, deleteTransaction, generateRecurringTransactions } from '../services/api.js'; // ✅ nova importação
import { useAuth } from '../hooks/useAuth.js';
import { useSnackbar } from '../context/SnackbarContext.jsx'; // ✅ Importar o nosso hook de snackbar
import { formatCurrency } from '../utils/currency.js';

function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const { user, logout } = useAuth();
  const showSnackbar = useSnackbar(); // ✅ Inicializar o hook de snackbar

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const response = await getTransactions();
      setTransactions(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) logout();
    }
  };

  const handleAddTransaction = async (transaction) => {
    try {
      await addTransaction(transaction);
      fetchTransactions();
      showSnackbar && showSnackbar('Transação adicionada com sucesso!', 'success'); // ✅ Mostrar notificação de sucesso
    } catch (error) { 
      console.error('Erro ao adicionar transação:', error);
      showSnackbar && showSnackbar('Erro ao adicionar transação.', 'error'); // ✅ Mostrar notificação de erro
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      fetchTransactions();
      showSnackbar && showSnackbar('Transação apagada com sucesso!', 'info'); // ✅ Mostrar notificação de informação
    } catch (error) { 
      console.error('Erro ao apagar transação:', error);
      showSnackbar && showSnackbar('Erro ao apagar transação.', 'error');
    }
  };

  // ✅ NOVA FUNÇÃO PARA O BOTÃO "MÁGICO"
  const handleGenerateRecurring = async () => {
    try {
      const response = await generateRecurringTransactions();
      showSnackbar && showSnackbar(response?.data?.message || 'Operação concluída!', 'success');
      fetchTransactions(); // Atualiza a lista principal de transações
    } catch (error) {
      console.error('Erro ao gerar recorrentes:', error);
      showSnackbar && showSnackbar('Erro ao gerar transações recorrentes.', 'error');
    }
  };

  const summary = useMemo(() => {
    const now = new Date();
    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear();
    });

    const income = currentMonthTransactions
      .filter(t => t.type === 'ganho')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = currentMonthTransactions
      .filter(t => t.type === 'gasto')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expenses: Math.abs(expenses),
      balance: income + expenses,
    };
  }, [transactions]);


  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
            Resumo de {new Date().toLocaleString('pt-PT', { month: 'long' })}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<SyncIcon />}
            onClick={handleGenerateRecurring}
            size="small"
          >
            Gerar Recorrentes do Mês
          </Button>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle1" color="text.secondary">Ganhos</Typography>
              <Typography variant="h5" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                {formatCurrency(summary.income, user?.preferredCurrency)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle1" color="text.secondary">Gastos</Typography>
              <Typography variant="h5" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                {formatCurrency(summary.expenses, user?.preferredCurrency)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle1" color="text.secondary">Saldo</Typography>
              {/* ✅ CORREÇÃO APLICADA AQUI ✅ */}
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: summary.balance >= 0 ? 'success.main' : 'error.main' }}>
                {formatCurrency(summary.balance, user?.preferredCurrency)}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <TransactionForm onAddTransaction={handleAddTransaction} />
          <TransactionList transactions={transactions} onDeleteTransaction={handleDeleteTransaction} />
        </Grid>
        <Grid item xs={12} md={7}>
          <Chat />
        </Grid>
      </Grid>
    </Container>
  );
}

export default DashboardPage;