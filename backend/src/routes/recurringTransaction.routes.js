import express from 'express';
import {
  getRecurringTransactions,
  createRecurringTransaction,
  deleteRecurringTransaction,
} from '../controllers/recurringTransaction.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/recurring-transactions')
  .get(getRecurringTransactions)
  .post(createRecurringTransaction);

router.route('/recurring-transactions/:id')
  .delete(deleteRecurringTransaction);

export default router;