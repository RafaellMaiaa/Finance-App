import express from 'express';
import { askAi } from '../controllers/ai.controller.js';

const router = express.Router();

// Quando receber um pedido POST em /api/ask-ai, executa a função askAi
router.post('/ask-ai', askAi);

export default router;