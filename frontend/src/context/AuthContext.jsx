import React, { createContext, useState, useEffect } from 'react';
import { setAuthToken, getUserProfile } from '../services/api.js';
import { useNavigate } from 'react-router-dom';

// 1. Exportamos o Context para que o nosso novo hook o possa usar
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        setAuthToken(storedToken);
        try {
          const res = await getUserProfile();
          setUser(res.data);
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
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

// 2. A exportação do 'useAuth' foi removida daqui!