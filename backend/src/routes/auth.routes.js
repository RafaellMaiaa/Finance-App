import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Função para criar o nosso token de sessão (JWT)
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// ROTA 1: Iniciar o processo de login
// O botão "Entrar com Google" no frontend irá levar o utilizador para este endereço.
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// ROTA 2: A rota de "callback"
// Depois de autorizar na Google, o utilizador é redirecionado de volta para aqui.
router.get('/auth/google/callback',
  // O Passport trata da verificação por nós. Se falhar, redireciona para a página de login.
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login`, session: false }),
  
  // Se a verificação for bem-sucedida, esta função é executada.
  (req, res) => {
    // req.user é o utilizador que o Passport encontrou ou criou na nossa BD.
    const token = createToken(req.user._id);

    // Finalmente, redirecionamos o utilizador de volta para o frontend,
    // passando o token de sessão no URL para que ele possa ser guardado.
    res.redirect(`${process.env.FRONTEND_URL}/verify-login?token=${token}`);
  }
);

export default router;