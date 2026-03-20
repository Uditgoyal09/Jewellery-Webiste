import { Router } from 'express';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createCallBooking, createContactQuery, createProductInquiry } from '../controllers/inquiryController.js';

const router = Router();

router.post('/contact-queries', asyncHandler(createContactQuery));
router.post('/call-bookings', optionalAuth, asyncHandler(createCallBooking));
router.post('/product-inquiries', optionalAuth, asyncHandler(createProductInquiry));

export default router;
