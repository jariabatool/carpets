// routes/coupons.js
import express from 'express';
import {
  createCoupon,
  validateCoupon,
  getSellerCoupons,
  deleteCoupon,
  cleanupCoupons
} from '../controllers/couponController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.post('/', authenticateToken, createCoupon);
router.post('/validate', authenticateToken, validateCoupon);
router.get('/seller/coupons', authenticateToken, getSellerCoupons);
router.delete('/:id', authenticateToken, deleteCoupon);
router.post('/cleanup', authenticateToken, requireAdmin, cleanupCoupons);

export default router;