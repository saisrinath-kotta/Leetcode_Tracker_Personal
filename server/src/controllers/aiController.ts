import { Response } from 'express';
import { AIService } from '../services/aiService.js';
import { Problem } from '../models/Problem.js';
import { isConnectedToDb } from '../config/db.js';
import { memoryProblems } from '../seed/seedProblems.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function explainProblem(req: AuthenticatedRequest, res: Response) {
  try {
    const { problemId, userCode, query } = req.body;
    const problem = await fetchProblem(problemId);
    if (!problem) return res.status(404).json({ message: 'Problem not found.' });

    const response = await AIService.queryMentor({
      action: 'explain',
      problem,
      userCode,
      userQuery: query,
    });
    return res.json(response);
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message });
  }
}

export async function getHint(req: AuthenticatedRequest, res: Response) {
  try {
    const { problemId, currentHintLevel = 0 } = req.body;
    const problem = await fetchProblem(problemId);
    if (!problem) return res.status(404).json({ message: 'Problem not found.' });

    const response = await AIService.queryMentor({
      action: 'hint',
      problem,
      currentHintLevel,
    });
    return res.json(response);
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message });
  }
}

export async function reviewCode(req: AuthenticatedRequest, res: Response) {
  try {
    const { problemId, code, language } = req.body;
    const problem = await fetchProblem(problemId);
    if (!problem) return res.status(404).json({ message: 'Problem not found.' });

    const response = await AIService.queryMentor({
      action: 'review',
      problem,
      userCode: code,
    });
    return res.json(response);
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message });
  }
}

export async function askMentor(req: AuthenticatedRequest, res: Response) {
  try {
    const { problemId, action = 'explain', code, query } = req.body;
    const problem = await fetchProblem(problemId);
    if (!problem) return res.status(404).json({ message: 'Problem not found.' });

    const response = await AIService.queryMentor({
      action,
      problem,
      userCode: code,
      userQuery: query,
    });
    return res.json(response);
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message });
  }
}

async function fetchProblem(problemId: string | number) {
  if (isConnectedToDb) {
    let p = await Problem.findById(problemId);
    if (!p && !isNaN(Number(problemId))) {
      p = await Problem.findOne({ number: Number(problemId) });
    }
    return p;
  } else {
    return memoryProblems.find((p) => p._id === problemId || `mem_${p.number}` === problemId || p.number === Number(problemId));
  }
}
