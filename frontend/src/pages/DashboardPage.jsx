import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Grid, AppBar, Toolbar, IconButton, Menu, MenuItem, Skeleton
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Chat from '../components/Chat.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import TransactionList from '../components/TransactionList.jsx';
import { getTransactions, addTransaction, deleteTransaction } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';

function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleProfile = () => { navigate('/profile'); handleClose(); };

  useEffect(() => {
    // Quando a página carrega, vai buscar as transações iniciais
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
      // ✅ ESTA É A LINHA MAIS IMPORTANTE:
      // Depois de adicionar, vai imediatamente buscar a lista atualizada.
      fetchTransactions();
    } catch (error) { 
      console.error('Erro ao adicionar transação:', error); 
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      // Também vai buscar a lista atualizada depois de apagar
      fetchTransactions();
    } catch (error) { 
      console.error('Erro ao apagar transação:', error); 
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent" elevation={1} sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Finance App
          </Typography>
          {user ? (
            <div>
              <IconButton size="large" onClick={handleMenu} color="inherit"><AccountCircle /></IconButton>
              <Typography variant="caption" sx={{ ml: 1 }}>Olá, {user.name ? user.name.split(' ')[0] : ''}</Typography>
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={handleProfile}>Editar Perfil</MenuItem>
                <MenuItem onClick={logout}>Sair</MenuItem>
              </Menu>
            </div>
          ) : (<Skeleton variant="circular" width={40} height={40} />)}
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl">
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
    </Box>
  );
}

export default DashboardPage;