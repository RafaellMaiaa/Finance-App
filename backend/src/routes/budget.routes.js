import express from 'express';
import { getBudgets, setBudget, deleteBudget } from '../controllers/budget.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Todas as rotas de orçamentos são protegidas
router.use(protect);

router.route('/budgets')
  .get(getBudgets)
  .post(setBudget);

router.route('/budgets/:id')
  .delete(deleteBudget);

export default router;