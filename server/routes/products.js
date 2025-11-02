// routes/products.js
import express from 'express';
import {
  getProductPreviews,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getSellerProducts,
  getCarpetMeta,
  getFilterMeta,
  getSubcategories,
  getSubcategoryByName,
  getProductsBySubcategory
} from '../controllers/productController.js';
import { authenticateToken, requireSeller } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/preview', getProductPreviews);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/all/all-products', getAllProducts);
router.get('/meta/carpet-meta', getCarpetMeta);
router.get('/meta/filter-meta', getFilterMeta);
router.get('/subcategories/list', getSubcategories);
router.get('/subcategories/:name', getSubcategoryByName);
router.get('/subcategory/:name/products', getProductsBySubcategory);

// Protected routes - seller only
router.post('/', authenticateToken, requireSeller, createProduct);
router.put('/:id', authenticateToken, requireSeller, updateProduct);
router.delete('/:id', authenticateToken, requireSeller, deleteProduct);
router.get('/seller/my-products', authenticateToken, requireSeller, getSellerProducts);

export default router;