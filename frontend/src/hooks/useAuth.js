import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx'; // Importa o contexto

// Esta é a nossa ferramenta, agora no seu próprio ficheiro.
export const useAuth = () => {
  return useContext(AuthContext);
};