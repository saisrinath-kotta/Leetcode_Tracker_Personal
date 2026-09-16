import { Router } from 'express';
import { explainProblem, getHint, reviewCode, askMentor } from '../controllers/aiController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/explain', authenticate, explainProblem);
router.post('/hint', authenticate, getHint);
router.post('/review', authenticate, reviewCode);
router.post('/ask', authenticate, askMentor);

export default router;
