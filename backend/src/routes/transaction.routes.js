import express from 'express';
import { getTransactions, addTransaction, deleteTransaction } from '../controllers/transaction.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();
router.use(protect); // Protege TODAS as rotas de transações

router.get('/transactions', getTransactions);
router.post('/transactions', addTransaction);
router.delete('/transactions/:id', deleteTransaction);

export default router;