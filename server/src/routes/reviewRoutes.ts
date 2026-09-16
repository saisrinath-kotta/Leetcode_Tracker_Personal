import { Router } from 'express';
import { getReviewQueue } from '../controllers/reviewController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getReviewQueue);

export default router;
