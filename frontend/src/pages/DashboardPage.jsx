import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Button } from '@mui/material';
import Chat from '../components/Chat.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import TransactionList from '../components/TransactionList.jsx';
import { getTransactions, addTransaction, deleteTransaction } from '../services/api.js';
import { useAuth } from '../context/AuthContext';

function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const { logout } = useAuth();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await getTransactions();
      setTransactions(response.data);
    } catch (error) {
      console.error('Erro ao obter transações:', error);
      // Se o token for inválido (erro 401), faz logout
      if (error.response && error.response.status === 401) {
        logout();
      }
    }
  };

  const handleAddTransaction = async (transaction) => {
    try {
      await addTransaction(transaction);
      fetchTransactions();
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      fetchTransactions();
    } catch (error) {
      console.error('Erro ao apagar transação:', error);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
          Painel de Finanças
        </Typography>
        <Button variant="outlined" color="primary" onClick={logout}>Sair</Button>
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