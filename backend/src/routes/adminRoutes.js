import { Router } from 'express';
import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  getDashboardData,
  updateCallBookingStatus,
  updateCategory,
  updateContactQueryStatus,
  updateProduct,
  updateProductInquiryStatus,
} from '../controllers/adminController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAdmin, requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/dashboard', asyncHandler(getDashboardData));
router.post('/categories', asyncHandler(createCategory));
router.patch('/categories/:categoryId', asyncHandler(updateCategory));
router.delete('/categories/:categoryId', asyncHandler(deleteCategory));
router.post('/products', asyncHandler(createProduct));
router.patch('/products/:productId', asyncHandler(updateProduct));
router.delete('/products/:productId', asyncHandler(deleteProduct));
router.patch('/contact-queries/:queryId', asyncHandler(updateContactQueryStatus));
router.patch('/call-bookings/:bookingId', asyncHandler(updateCallBookingStatus));
router.patch('/product-inquiries/:inquiryId', asyncHandler(updateProductInquiryStatus));

export default router;
