import express from 'express';
import { requestLoginLink, verifyLogin } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/auth/login', requestLoginLink); // Agora pede o link
router.post('/auth/verify', verifyLogin);   // Nova rota para verificar o link

export default router;