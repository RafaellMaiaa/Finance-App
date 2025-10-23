import express from 'express';
import {
  getRecurringTransactions,
  createRecurringTransaction,
  deleteRecurringTransaction,
  checkAndNotifyRecurring, // ...changed...
} from '../controllers/recurringTransaction.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/recurring-transactions')
  .get(getRecurringTransactions)
  .post(createRecurringTransaction);

router.route('/recurring-transactions/:id')
  .delete(deleteRecurringTransaction);

// ✅ NOVA ROTA PARA ATIVAR A VERIFICAÇÃO DE LEMBRETES ✅
router.post('/recurring-transactions/check-notify', checkAndNotifyRecurring);

export default router;