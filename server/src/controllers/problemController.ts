import { Response } from 'express';
import { Problem } from '../models/Problem.js';
import { UserProgress } from '../models/UserProgress.js';
import { memoryProblems } from '../seed/seedProblems.js';
import { isConnectedToDb } from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function getProblems(req: AuthenticatedRequest, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = ((req.query.search as string) || '').trim().toLowerCase();
    const difficulty = (req.query.difficulty as string) || '';
    const status = (req.query.status as string) || '';
    const topic = (req.query.topic as string) || '';
    const pattern = (req.query.pattern as string) || '';
    const sortBy = (req.query.sortBy as string) || 'number';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    let total = 0;
    let problems: any[] = [];
    const userId = req.user?.id;

    if (isConnectedToDb) {
      const query: any = {};
      if (difficulty) query.difficulty = difficulty;
      if (topic) query.topics = topic;
      if (pattern) query.patterns = pattern;

      if (search) {
        const numSearch = parseInt(search, 10);
        if (!isNaN(numSearch)) {
          query.$or = [{ number: numSearch }, { title: { $regex: search, $options: 'i' } }];
        } else {
          query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { topics: { $regex: search, $options: 'i' } },
            { patterns: { $regex: search, $options: 'i' } },
            { tags: { $regex: search, $options: 'i' } },
          ];
        }
      }

      total = await Problem.countDocuments(query);
      problems = await Problem.find(query)
        .select('number title slug difficulty topics patterns leetcodeUrl tags category learningObjective')
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      // Attach user status
      if (userId && problems.length > 0) {
        const problemIds = problems.map((p) => p._id);
        const progressList = await UserProgress.find({ userId, problemId: { $in: problemIds } }).lean();
        const progressMap = new Map(progressList.map((pr) => [pr.problemId.toString(), pr]));

        problems = problems.map((p) => ({
          ...p,
          userStatus: progressMap.get(p._id.toString())?.status || 'Not Started',
          userConfidence: progressMap.get(p._id.toString())?.confidence || 0,
        }));
      }
    } else {
      // Memory fallback implementation
      let filtered = [...memoryProblems];
      if (difficulty) filtered = filtered.filter((p) => p.difficulty === difficulty);
      if (topic) filtered = filtered.filter((p) => p.topics.includes(topic));
      if (pattern) filtered = filtered.filter((p) => p.patterns.includes(pattern));
      if (search) {
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(search) ||
            p.number.toString() === search ||
            p.topics.some((t: string) => t.toLowerCase().includes(search)) ||
            p.patterns.some((pt: string) => pt.toLowerCase().includes(search))
        );
      }

      total = filtered.length;
      problems = filtered.slice((page - 1) * limit, page * limit).map((p, idx) => ({
        ...p,
        _id: p._id || `mem_${p.number}`,
        userStatus: p.number === 1 ? 'Solved' : p.number === 287 ? 'Attempted' : 'Not Started',
        userConfidence: p.number === 1 ? 5 : p.number === 287 ? 3 : 0,
      }));
    }

    const totalPages = Math.ceil(total / limit) || 1;

    return res.json({
      problems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message });
  }
}

export async function getProblemByNumber(req: AuthenticatedRequest, res: Response) {
  try {
    const num = parseInt(req.params.number, 10);
    let problem: any = null;

    if (isConnectedToDb) {
      problem = await Problem.findOne({ number: num }).lean();
    } else {
      problem = memoryProblems.find((p) => p.number === num);
      if (problem) {
        problem = { ...problem, _id: problem._id || `mem_${problem.number}` };
      }
    }

    if (!problem) {
      return res.status(404).json({ message: `Problem #${num} not found.` });
    }

    // Attach user progress details
    let progress = null;
    if (req.user?.id && isConnectedToDb) {
      progress = await UserProgress.findOne({ userId: req.user.id, problemId: problem._id }).lean();
    }

    return res.json({
      problem,
      progress: progress || {
        status: num === 1 ? 'Solved' : num === 287 ? 'Attempted' : 'Not Started',
        confidence: num === 1 ? 5 : num === 287 ? 3 : 0,
        attemptsCount: num === 1 ? 1 : num === 287 ? 2 : 0,
        hintsUsed: num === 287 ? 1 : 0,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message });
  }
}

export async function getProblemById(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    let problem: any = null;

    if (isConnectedToDb) {
      problem = await Problem.findById(id).lean();
    } else {
      problem = memoryProblems.find((p) => p._id === id || `mem_${p.number}` === id);
    }

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found.' });
    }

    return res.json({ problem });
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message });
  }
}
