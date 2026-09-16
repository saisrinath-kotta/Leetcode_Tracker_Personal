import { Router } from 'express';
import { createSubmission, getSubmissions } from '../controllers/submissionController.js';
import { authenticate, requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, requireAuth, getSubmissions);
router.post('/', authenticate, requireAuth, createSubmission);

export default router;
