import { Router } from 'express';
import { generatePracticeSession } from '../controllers/practiceController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/generate', authenticate, generatePracticeSession);

export default router;
