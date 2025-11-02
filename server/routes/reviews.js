// routes/reviews.js
import express from 'express';
import { createReview, getReviewsByCarpet } from '../controllers/reviewController.js';

const router = express.Router();

// Public routes
router.post('/', createReview);
router.get('/:carpetId', getReviewsByCarpet);

export default router;