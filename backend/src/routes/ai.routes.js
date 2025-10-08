import express from 'express';
import { askAi } from '../controllers/ai.controller.js';
import { protect } from '../middleware/auth.middleware.js'; // 1. Importar o nosso "segurança"

const router = express.Router();

// 2. Colocar o "segurança" (protect) a guardar esta rota
router.post('/ask-ai', protect, askAi);

export default router;