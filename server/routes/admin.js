// routes/admin.js
import express from 'express';
import { 
  getPendingApprovals,
  approveUser,
  rejectUser,
  getSellers,
  getBuyers,
  getSellerById,
  getSellerProducts,
  getSellerOrders,
  updateSeller,
  deleteSeller,
  updateOrderStatus,
  getBuyerById,
  getBuyerOrders
} from '../controllers/adminController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// User management
router.get('/pending-approvals', getPendingApprovals);
router.patch('/approve-user/:id', approveUser);
router.delete('/reject-user/:id', rejectUser);

// Seller management
router.get('/sellers', getSellers);
router.get('/sellers/:id', getSellerById);
router.get('/sellers/:id/products', getSellerProducts);
router.get('/sellers/:id/orders', getSellerOrders);
router.put('/sellers/:id', updateSeller);
router.delete('/sellers/:id', deleteSeller);

// Buyer management
router.get('/buyers', getBuyers);
router.get('/buyers/:id', getBuyerById);
router.get('/buyers/:id/orders', getBuyerOrders);

// Order management
router.patch('/orders/:id', updateOrderStatus);

export default router;