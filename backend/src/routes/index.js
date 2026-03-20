import { Router } from 'express';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import catalogRoutes from './catalogRoutes.js';
import wishlistRoutes from './wishlistRoutes.js';
import inquiryRoutes from './inquiryRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use(catalogRoutes);
router.use('/wishlist', wishlistRoutes);
router.use(inquiryRoutes);

export default router;
