// routes/users.js
import express from 'express';
import { updateProfile, getSellers, getSellerById } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/sellers', getSellers);
router.get('/sellers/:id', getSellerById);

// Protected routes
router.put('/profile/update', authenticateToken, updateProfile);

export default router;