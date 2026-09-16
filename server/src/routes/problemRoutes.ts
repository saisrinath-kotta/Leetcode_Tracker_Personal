import { Router } from 'express';
import { getProblems, getProblemByNumber, getProblemById } from '../controllers/problemController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getProblems);
router.get('/number/:number', authenticate, getProblemByNumber);
router.get('/:id', authenticate, getProblemById);

export default router;
