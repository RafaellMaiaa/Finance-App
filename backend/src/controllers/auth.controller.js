import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendLoginEmail } from '../services/email.js';

const createSessionToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const requestLoginLink = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email });
    }

    const loginToken = user.createLoginToken();

    // -- DEBUG LOGS --
    console.log('\n--- A GERAR TOKEN DE LOGIN ---');
    console.log('DEBUG: Token Original (para o email):', loginToken);
    console.log('DEBUG: Token Hashed (guardado na BD):', user.loginToken);
    // -- FIM DEBUG LOGS --

    await user.save({ validateBeforeSave: false });

    const loginURL = `${process.env.FRONTEND_URL}/verify-login?token=${loginToken}`;
    await sendLoginEmail({
      email: user.email,
      url: loginURL,
    });

    res.status(200).json({ message: 'Link de login enviado para o seu email!' });

  } catch (error) {
    console.error('❌ ERRO AO PEDIR O LINK:', error);
    res.status(500).json({ error: 'Erro ao enviar o email. Tente novamente.' });
  }
};

export const verifyLogin = async (req, res) => {
  try {
    const { token } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // -- DEBUG LOGS --
    console.log('\n--- A VERIFICAR O TOKEN ---');
    console.log('DEBUG: Token Original (recebido do link):', token);
    console.log('DEBUG: Token Hashed (para procurar na BD):', hashedToken);
    // -- FIM DEBUG LOGS --

    const user = await User.findOne({
      loginToken: hashedToken,
      loginTokenExpires: { $gt: Date.now() },
    });

    // -- DEBUG LOGS --
    console.log('DEBUG: Resultado da procura na BD (user):', user ? `Utilizador ${user.email} encontrado!` : 'Nenhum utilizador encontrado.');
    // -- FIM DEBUG LOGS --

    if (!user) {
      return res.status(400).json({ error: 'Token inválido ou expirado.' });
    }

    user.loginToken = undefined;
    user.loginTokenExpires = undefined;
    await user.save();

    const sessionToken = createSessionToken(user._id);
    res.status(200).json({ token: sessionToken });
    console.log('--- VERIFICAÇÃO BEM-SUCEDIDA ---');

  } catch (error) { // ✅ ERRO CORRIGIDO AQUI
    console.error('❌ ERRO AO VERIFICAR O TOKEN:', error);
    res.status(500).json({ error: 'Erro ao verificar o login.' });
  }
};