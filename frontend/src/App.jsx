import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import Chat from './components/Chat.jsx';
import TransactionForm from './components/TransactionForm.jsx';
import TransactionList from './components/TransactionList.jsx';
import { getTransactions, addTransaction, deleteTransaction } from './services/api.js';

function App() {
  const [transactions, setTransactions] = useState([]);

  // Efeito para ir buscar as transações à API quando a app carrega
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await getTransactions();
      setTransactions(response.data);
    } catch (error) {
      console.error('Erro ao obter transações:', error);
    }
  };

  const handleAddTransaction = async (transaction) => {
    try {
      await addTransaction(transaction);
      fetchTransactions(); // Atualiza a lista depois de adicionar
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      fetchTransactions(); // Atualiza a lista depois de apagar
    } catch (error) {
      console.error('Erro ao apagar transação:', error);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Painel de Finanças com IA
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Coluna da Esquerda: Adicionar e Ver Transações */}
        <Grid item xs={12} md={5}>
          <TransactionForm onAddTransaction={handleAddTransaction} />
          <TransactionList transactions={transactions} onDeleteTransaction={handleDeleteTransaction} />
        </Grid>

        {/* Coluna da Direita: Chat com a IA */}
        <Grid item xs={12} md={7}>
          <Chat />
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;