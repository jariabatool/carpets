// routes/orders.js
import express from 'express';
import {
  createOrder,
  getOrders,
  getSellerOrders,
  updateOrderStatus,
  confirmPayment
} from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', createOrder);
router.get('/', getOrders);
router.put('/:id/status', updateOrderStatus);
router.post('/:id/confirm-payment', confirmPayment);

// Protected routes
router.get('/seller/orders', authenticateToken, getSellerOrders);

export default router;