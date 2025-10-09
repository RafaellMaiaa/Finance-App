import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Procuramos o utilizador na base de dados
      req.user = await User.findById(decoded.id).select('-password');

      // ✅ CORREÇÃO CRUCIAL AQUI ✅
      // Se, depois de procurar, o utilizador não for encontrado, recusamos o acesso.
      if (!req.user) {
        return res.status(401).json({ error: 'Não autorizado, utilizador não encontrado.' });
      }
      
      // Se encontrarmos o utilizador, deixamos o pedido continuar.
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Não autorizado, token falhou.' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Não autorizado, sem token.' });
  }
};