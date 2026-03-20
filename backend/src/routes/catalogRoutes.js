import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getCategories, getProducts } from '../controllers/catalogController.js';

const router = Router();

router.get('/categories', asyncHandler(getCategories));
router.get('/products', asyncHandler(getProducts));

export default router;
