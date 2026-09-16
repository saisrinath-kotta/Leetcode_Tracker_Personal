import { Response } from 'express';
import { Problem } from '../models/Problem.js';
import { UserProgress } from '../models/UserProgress.js';
import { isConnectedToDb } from '../config/db.js';
import { memoryProblems } from '../seed/seedProblems.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function getReviewQueue(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id || '660000000000000000000001';

    if (isConnectedToDb) {
      const progressList = await UserProgress.find({ userId }).populate('problemId').lean();

      const reviewItems = progressList
        .filter((pr) => pr.confidence <= 3 || pr.status === 'Attempted' || pr.mistakes)
        .map((pr: any) => ({
          problem: pr.problemId,
          userStatus: pr.status,
          confidence: pr.confidence,
          attemptsCount: pr.attemptsCount,
          lastAttemptedAt: pr.lastAttemptedAt,
          solvedAt: pr.solvedAt,
          mistakes: pr.mistakes,
          reason:
            pr.confidence <= 2
              ? 'Low Confidence rating'
              : pr.status === 'Attempted'
              ? 'Unsolved Attempt'
              : pr.mistakes
              ? 'Recorded Mistake'
              : 'Spaced Repetition Review',
        }));

      return res.json({ reviewItems });
    } else {
      const reviewItems = memoryProblems.slice(0, 4).map((p, idx) => ({
        problem: p,
        userStatus: idx === 0 ? 'Attempted' : 'Solved',
        confidence: idx === 0 ? 3 : 2,
        attemptsCount: idx + 1,
        lastAttemptedAt: new Date(Date.now() - (idx + 2) * 86400000),
        reason: idx === 0 ? 'Low Confidence (3/5)' : 'Spaced Repetition (Solved 5 days ago)',
      }));

      return res.json({ reviewItems });
    }
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message });
  }
}
