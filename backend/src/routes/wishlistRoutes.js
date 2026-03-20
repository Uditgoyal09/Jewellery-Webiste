import { Router } from 'express';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(requireAuth);
router.get('/', asyncHandler(getWishlist));
router.post('/:productId', asyncHandler(addToWishlist));
router.delete('/:productId', asyncHandler(removeFromWishlist));

export default router;
