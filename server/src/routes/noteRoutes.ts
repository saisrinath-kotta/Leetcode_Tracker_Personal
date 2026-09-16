import { Router } from 'express';
import { getNotes, getNoteByProblemId, updateNote, deleteNote } from '../controllers/noteController.js';
import { authenticate, requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, requireAuth, getNotes);
router.get('/:problemId', authenticate, requireAuth, getNoteByProblemId);
router.put('/:problemId', authenticate, requireAuth, updateNote);
router.delete('/:id', authenticate, requireAuth, deleteNote);

export default router;
