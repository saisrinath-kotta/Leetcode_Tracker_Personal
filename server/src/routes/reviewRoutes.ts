import { Router } from 'express';
import { getReviewQueue } from '../controllers/reviewController.js';
import { authenticate, requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, requireAuth, getReviewQueue);

export default router;
