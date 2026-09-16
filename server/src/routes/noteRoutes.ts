import { Router } from 'express';
import { getNotes, getNoteByProblemId, updateNote } from '../controllers/noteController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getNotes);
router.get('/:problemId', authenticate, getNoteByProblemId);
router.put('/:problemId', authenticate, updateNote);

export default router;
