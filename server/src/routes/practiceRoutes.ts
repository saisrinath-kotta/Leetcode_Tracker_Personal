import { Router } from 'express';
import { generatePracticeSession } from '../controllers/practiceController.js';
import { authenticate, requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/generate', authenticate, requireAuth, generatePracticeSession);

export default router;
