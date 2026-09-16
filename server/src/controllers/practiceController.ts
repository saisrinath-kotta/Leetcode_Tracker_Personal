import { Response } from 'express';
import { Problem } from '../models/Problem.js';
import { PracticeSession } from '../models/PracticeSession.js';
import { isConnectedToDb } from '../config/db.js';
import { memoryProblems } from '../seed/seedProblems.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function generatePracticeSession(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const { topics = [], difficulty = '', patterns = [], count = 3 } = req.body;

    let selectedProblems: any[] = [];

    if (isConnectedToDb) {
      const query: any = {};
      if (difficulty) query.difficulty = difficulty;
      if (topics.length > 0) query.topics = { $in: topics };
      if (patterns.length > 0) query.patterns = { $in: patterns };

      selectedProblems = await Problem.find(query).limit(count).lean();

      if (selectedProblems.length === 0) {
        selectedProblems = await Problem.find({}).limit(count).lean();
      }

      const session = await PracticeSession.create({
        userId,
        topics,
        difficulty,
        patterns,
        problems: selectedProblems.map((p) => ({
          problemId: p._id,
          problemNumber: p.number,
          title: p.title,
          difficulty: p.difficulty,
          status: 'Pending',
          hintsUsed: 0,
          timeSpentSeconds: 0,
        })),
        totalTimeSeconds: 0,
      });

      return res.status(201).json({ session, problems: selectedProblems });
    } else {
      let filtered = [...memoryProblems];
      if (difficulty) filtered = filtered.filter((p) => p.difficulty === difficulty);
      if (topics.length > 0) filtered = filtered.filter((p) => p.topics.some((t: string) => topics.includes(t)));

      selectedProblems = (filtered.length > 0 ? filtered : memoryProblems).slice(0, count);

      const session = {
        _id: `prac_${Date.now()}`,
        userId,
        topics,
        difficulty,
        patterns,
        problems: selectedProblems.map((p) => ({
          problemId: p._id || `mem_${p.number}`,
          problemNumber: p.number,
          title: p.title,
          difficulty: p.difficulty,
          status: 'Pending',
          hintsUsed: 0,
          timeSpentSeconds: 0,
        })),
        totalTimeSeconds: 0,
        createdAt: new Date(),
      };

      return res.status(201).json({ session, problems: selectedProblems });
    }
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message });
  }
}
