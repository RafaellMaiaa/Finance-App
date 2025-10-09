import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Grid, AppBar, Toolbar, IconButton, Menu, MenuItem, Skeleton,
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SavingsIcon from '@mui/icons-material/Savings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import CategoryIcon from '@mui/icons-material/Category';
import SettingsIcon from '@mui/icons-material/Settings';

import Chat from '../components/Chat.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import TransactionList from '../components/TransactionList.jsx';
import { getTransactions, addTransaction, deleteTransaction } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';

function DashboardPage({ toggleTheme }) {
  const [transactions, setTransactions] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const openUserMenu = Boolean(anchorEl);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleProfile = () => { navigate('/profile'); handleClose(); };
  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);
  
  // Funções para navegar para as novas páginas
  const navigateTo = (path) => {
    navigate(path);
    handleDrawerToggle();
  };

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => { /* ... (código igual) */ };
  const handleAddTransaction = async (transaction) => { /* ... (código igual) */ };
  const handleDeleteTransaction = async (id) => { /* ... (código igual) */ };

  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation">
      <Toolbar />
      <Divider />
      <List>
        <ListItem disablePadding><ListItemButton onClick={() => navigateTo('/')}><ListItemIcon><DashboardIcon /></ListItemIcon><ListItemText primary="Painel Principal" /></ListItemButton></ListItem>
        <ListItem disablePadding><ListItemButton onClick={() => navigateTo('/reports')}><ListItemIcon><BarChartIcon /></ListItemIcon><ListItemText primary="Relatórios" /></ListItemButton></ListItem>
        <ListItem disablePadding><ListItemButton onClick={() => navigateTo('/categories')}><ListItemIcon><CategoryIcon /></ListItemIcon><ListItemText primary="Categorias" /></ListItemButton></ListItem>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding><ListItemButton onClick={() => navigateTo('/settings')}><ListItemIcon><SettingsIcon /></ListItemIcon><ListItemText primary="Definições" /></ListItemButton></ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" elevation={1} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
        <Toolbar>
          <IconButton color="inherit" onClick={handleDrawerToggle} sx={{ mr: 2 }}><MenuIcon /></IconButton>
          <SavingsIcon color="primary" sx={{ mr: 1.5 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>Finance Flow</Typography>
          <IconButton onClick={toggleTheme} color="inherit">{theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}</IconButton>
          {user ? (
            <div>
              <IconButton size="large" onClick={handleMenu} color="inherit"><AccountCircle /></IconButton>
              <Menu anchorEl={anchorEl} open={openUserMenu} onClose={handleClose}>
                <MenuItem onClick={handleProfile}>Editar Perfil</MenuItem>
                <MenuItem onClick={logout}>Sair</MenuItem>
              </Menu>
            </div>
          ) : (<Skeleton variant="circular" width={40} height={40} />)}
        </Toolbar>
      </AppBar>
      <Drawer open={drawerOpen} onClose={handleDrawerToggle}>{drawerContent}</Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%' }}><Toolbar />
        <Container maxWidth="xl" sx={{ mt: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <TransactionForm onAddTransaction={handleAddTransaction} />
              <TransactionList transactions={transactions} onDeleteTransaction={handleDeleteTransaction} />
            </Grid>
            <Grid item xs={12} md={7}><Chat /></Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

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
// Cole as funções fetchTransactions, handleAddTransaction e handleDeleteTransaction aqui dentro
export default DashboardPage;