import express from 'express';
import { 
  getTransactions, 
  addTransaction, 
  deleteTransaction,
  generateRecurringTransactions // 1. Importar a nova função
} from '../controllers/transaction.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();
router.use(protect); // Protege TODAS as rotas de transações

// 2. Adicionar a nova rota "mágica"
router.post('/transactions/generate-recurring', generateRecurringTransactions);

router.get('/transactions', getTransactions);
router.post('/transactions', addTransaction);
router.delete('/transactions/:id', deleteTransaction);

export default router;