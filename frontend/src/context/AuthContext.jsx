import React, { createContext, useState, useEffect } from 'react';
import { setAuthToken, getUserProfile } from '../services/api.js';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Esta função corre apenas uma vez quando a App é carregada ou a página é atualizada
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        setAuthToken(storedToken); // Configura o axios logo no início
        try {
          const res = await getUserProfile();
          setUser(res.data);
        } catch (err) {
          // Se o token guardado for inválido, limpa tudo
          localStorage.removeItem('token');
          setAuthToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (newToken) => {
    localStorage.setItem('token', newToken);
    setAuthToken(newToken); 
    setToken(newToken);
    try {
      const res = await getUserProfile();
      setUser(res.data);
    } catch (err) {
      logout();
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    setAuthToken(null);
    navigate('/login');
  };
  
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};