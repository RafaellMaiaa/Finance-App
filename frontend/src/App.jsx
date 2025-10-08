import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import VerifyLoginPage from './pages/VerifyLoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Rota para a página de login, acessível a todos */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rota para onde o utilizador é redirecionado a partir do email para verificar o token */}
      <Route path="/verify-login" element={<VerifyLoginPage />} />

      {/* Rota principal ("/") que mostra o painel de finanças.
          Está protegida pelo ProtectedRoute, que só permite o acesso a utilizadores com login. */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
