import { Router } from 'express';
import authRoutes from './authRoutes.js';
import problemRoutes from './problemRoutes.js';
import progressRoutes from './progressRoutes.js';
import submissionRoutes from './submissionRoutes.js';
import noteRoutes from './noteRoutes.js';
import aiRoutes from './aiRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import practiceRoutes from './practiceRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/problems', problemRoutes);
router.use('/progress', progressRoutes);
router.use('/submissions', submissionRoutes);
router.use('/notes', noteRoutes);
router.use('/ai', aiRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/review', reviewRoutes);
router.use('/practice', practiceRoutes);

export default router;
