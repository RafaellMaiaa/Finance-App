import express from 'express';
import { getTransactions, addTransaction, deleteTransaction } from '../controllers/transaction.controller.js';

const router = express.Router();

// ✅ CORRIGIDO
router.get('/transactions', getTransactions);
router.post('/transactions', addTransaction);
router.delete('/transactions/:id', deleteTransaction);

export default router;