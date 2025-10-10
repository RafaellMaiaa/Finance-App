import express from 'express';
import { getTransactions, addTransaction, deleteTransaction } from '../controllers/transaction.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Aplica o "segurança" (middleware 'protect') a TODAS as rotas abaixo
router.use(protect);

router.get('/transactions', getTransactions);
router.post('/transactions', addTransaction);
router.delete('/transactions/:id', deleteTransaction);

export default router;