import React, { useState, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

import Layout from './components/Layout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import VerifyLoginPage from './pages/VerifyLoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import CategoriesPage from './pages/CategoriesPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import BudgetsPage from './pages/BudgetsPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  const [mode, setMode] = useState('dark');
  
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'dark'
            ? {
                primary: { main: '#00C2A8' },
                background: { default: '#1A202C', paper: '#2D3748' },
                text: { primary: '#E0E0E0', secondary: '#A0AEC0' },
              }
            : {
                primary: { main: '#008070' },
                background: { default: '#F7FAFC', paper: '#FFFFFF' },
                text: { primary: '#2D3748', secondary: '#718096' },
              }),
        },
        typography: {
          fontFamily: ['"Inter"', 'sans-serif'].join(','),
        },
      }),
    [mode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-login" element={<VerifyLoginPage />} />

        {/* ✅ A função 'toggleTheme' é passada aqui para o Layout */}
        <Route element={<ProtectedRoute><Layout toggleTheme={toggleTheme} /></ProtectedRoute>}>
          <Route path="/" element={<DashboardPage toggleTheme={toggleTheme} />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;