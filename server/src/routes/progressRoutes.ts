import { Router } from 'express';
import { getProgress, getProgressByProblemId, updateProgress } from '../controllers/progressController.js';
import { authenticate, requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, requireAuth, getProgress);
router.get('/:problemId', authenticate, requireAuth, getProgressByProblemId);
router.put('/:problemId', authenticate, requireAuth, updateProgress);

export default router;
