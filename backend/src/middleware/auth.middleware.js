import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
      if (!req.user) {
        return res.status(401).json({ error: 'Não autorizado, utilizador não encontrado.' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Não autorizado, token inválido.' });
    }
  }
  if (!token) {
    return res.status(401).json({ error: 'Não autorizado, sem token.' });
  }
};