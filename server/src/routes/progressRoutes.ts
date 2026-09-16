import { Router } from 'express';
import { getProgress, getProgressByProblemId, updateProgress } from '../controllers/progressController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getProgress);
router.get('/:problemId', authenticate, getProgressByProblemId);
router.put('/:problemId', authenticate, updateProgress);

export default router;
