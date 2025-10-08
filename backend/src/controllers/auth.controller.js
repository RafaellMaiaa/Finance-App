// Ficheiro: backend/src/controllers/auth.controller.js

import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendLoginEmail } from '../services/email.js';

const createSessionToken = (id) => {
  // ... (código igual)
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const requestLoginLink = async (req, res) => {
  console.log('\n--- Novo Pedido de Login Recebido ---');
  try {
    const { email } = req.body;
    console.log(`1. Email recebido: ${email}`);

    let user = await User.findOne({ email });
    if (!user) {
      console.log('2. Utilizador não encontrado, a criar um novo...');
      user = await User.create({ email });
      console.log('3. Novo utilizador criado com ID:', user._id);
    } else {
      console.log('2. Utilizador encontrado com ID:', user._id);
    }

    const loginToken = user.createLoginToken();
    await user.save({ validateBeforeSave: false });
    console.log('3. Token de login temporário criado e guardado na BD.');

    const loginURL = `${process.env.FRONTEND_URL}/verify-login?token=${loginToken}`;
    console.log(`4. A preparar para enviar email com o URL: ${loginURL}`);

    await sendLoginEmail({
      email: user.email,
      url: loginURL,
    });
    console.log('5. Função sendLoginEmail terminou. A enviar resposta de sucesso.');

    res.status(200).json({ message: 'Link de login enviado para o seu email!' });
    console.log('--- Pedido de Login Terminado com Sucesso ---\n');

  } catch (error) {
    console.error('❌ ERRO APANHADO NO CONTROLLER:', error);
    res.status(500).json({ error: 'Erro ao enviar o email. Tente novamente.' });
    console.log('--- Pedido de Login Terminado com Erro ---\n');
  }
};

export const verifyLogin = async (req, res) => {
  // ... (código igual)
  try {
    const { token } = req.body;
    const hashedToken = crypto.createHash('sha264').update(token).digest('hex');

    const user = await User.findOne({
      loginToken: hashedToken,
      loginTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Token inválido ou expirado.' });
    }

    user.loginToken = undefined;
    user.loginTokenExpires = undefined;
    await user.save();

    const sessionToken = createSessionToken(user._id);
    res.status(200).json({ token: sessionToken });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao verificar o login.' });
  }
};