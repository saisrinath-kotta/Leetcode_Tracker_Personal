import { Router } from 'express';
import { createSubmission, getSubmissions } from '../controllers/submissionController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getSubmissions);
router.post('/', authenticate, createSubmission);

export default router;
