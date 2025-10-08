import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error('Erro na verificação do token:', error);
      return res.status(401).json({ error: 'Não autorizado, token falhou.' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Não autorizado, sem token.' });
  }
};