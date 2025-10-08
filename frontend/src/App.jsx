import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import VerifyLoginPage from './pages/VerifyLoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <Routes>
      {/* Rotas públicas que não exigem login */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify-login" element={<VerifyLoginPage />} />
      
      {/* Rota principal (Dashboard), protegida por login */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Rota da página de Perfil, também protegida */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;