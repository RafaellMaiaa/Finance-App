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
  const { user, logout } = useAuth(); // 'user' pode ser null enquanto carrega
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

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
      console.error('Erro ao obter transações:', error);
      // ✅ Linha importante: se o token for inválido, faz logout
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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent" elevation={1} sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Finance App
          </Typography>
          
          {/* ✅ CORREÇÃO APLICADA AQUI */}
          {user ? (
            <div>
              <IconButton
                size="large"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Typography variant="caption" sx={{ ml: 1 }}>
                {/* Acedemos a user.name só depois de confirmar que user existe */}
                Olá, {user.name ? user.name.split(' ')[0] : ''}
              </Typography>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfile}>Editar Perfil</MenuItem>
                <MenuItem onClick={logout}>Sair</MenuItem>
              </Menu>
            </div>
          ) : (
            // Mostra um placeholder enquanto o 'user' não chega
            <Skeleton variant="circular" width={40} height={40} />
          )}
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