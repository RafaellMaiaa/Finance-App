import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Todas estas rotas são protegidas, precisam de login
router.route('/users/me')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;