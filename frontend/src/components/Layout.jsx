import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Box, AppBar, Toolbar, IconButton, Typography, Drawer, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Skeleton, useTheme
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
import { useAuth } from '../hooks/useAuth.js';

function Layout({ toggleTheme }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openUserMenu = Boolean(anchorEl);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleProfile = () => { navigate('/profile'); handleClose(); };

  const navigateTo = (path) => {
    navigate(path);
    if (drawerOpen) {
      handleDrawerToggle();
    }
  };

  const menuItems = [
    { text: 'Painel Principal', icon: <DashboardIcon />, path: '/' },
    { text: 'Relatórios', icon: <BarChartIcon />, path: '/reports' },
    { text: 'Categorias', icon: <CategoryIcon />, path: '/categories' },
  ];

  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation">
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigateTo(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigateTo('/settings')}>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Definições" />
          </ListItemButton>
        </ListItem>
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

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%' }}>
        <Toolbar />
        <Outlet /> {/* As nossas páginas (Dashboard, Reports, etc.) serão renderizadas aqui */}
      </Box>
    </Box>
  );
}

export default Layout;