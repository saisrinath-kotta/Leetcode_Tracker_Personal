import { Response } from 'express';
import { UserProgress } from '../models/UserProgress.js';
import { Problem } from '../models/Problem.js';
import { isConnectedToDb } from '../config/db.js';
import { memoryProgress } from '../seed/seedProblems.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function getProgress(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.json({ progress: [] });
    }

    if (isConnectedToDb) {
      const progressList = await UserProgress.find({ userId }).populate('problemId', 'number title difficulty topics patterns').lean();
      return res.json({ progress: progressList });
    } else {
      return res.json({ progress: [] });
    }
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message });
  }
}

export async function getProgressByProblemId(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.json({ progress: null });
    }
    const { problemId } = req.params;

    if (isConnectedToDb) {
      const pr = await UserProgress.findOne({ userId, problemId }).lean();
      return res.json({ progress: pr || null });
    } else {
      return res.json({ progress: null });
    }
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message });
  }
}

export async function updateProgress(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const { problemId } = req.params;
    const { status, confidence, notes, mistakes, personalCode, language, code, hintsUsed } = req.body;

    if (isConnectedToDb) {
      let problem = await Problem.findById(problemId);
      if (!problem && !isNaN(Number(problemId))) {
        problem = await Problem.findOne({ number: Number(problemId) });
      }

      if (!problem) {
        return res.status(404).json({ message: 'Problem not found' });
      }

      const updateObj: any = {
        userId,
        problemId: problem._id,
        problemNumber: problem.number,
        updatedAt: new Date(),
      };

      if (status) updateObj.status = status;
      if (confidence !== undefined) updateObj.confidence = confidence;
      if (notes !== undefined) updateObj.notes = notes;
      if (mistakes !== undefined) updateObj.mistakes = mistakes;
      if (hintsUsed !== undefined) updateObj.hintsUsed = hintsUsed;
      if (status === 'Solved') updateObj.solvedAt = new Date();

      let pr = await UserProgress.findOne({ userId, problemId: problem._id });
      if (!pr) {
        pr = new UserProgress(updateObj);
      } else {
        Object.assign(pr, updateObj);
      }

      if (language && code) {
        if (!pr.personalCode) pr.personalCode = new Map();
        pr.personalCode.set(language, code);
      }

      await pr.save();
      return res.json({ progress: pr });
    } else {
      const key = `${userId}_${problemId}`;
      const existing = memoryProgress.get(key) || {
        userId,
        problemId,
        status: status || 'Not Started',
        confidence: confidence || 0,
        personalCode: {},
      };

      if (status) existing.status = status;
      if (confidence !== undefined) existing.confidence = confidence;
      if (notes !== undefined) existing.notes = notes;
      if (language && code) existing.personalCode[language] = code;

      memoryProgress.set(key, existing);
      return res.json({ progress: existing });
    }
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message });
  }
}
