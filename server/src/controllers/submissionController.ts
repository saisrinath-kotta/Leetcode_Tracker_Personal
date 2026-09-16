import { Response } from 'express';
import { Submission } from '../models/Submission.js';
import { Problem } from '../models/Problem.js';
import { UserProgress } from '../models/UserProgress.js';
import { CodeExecutionService } from '../services/codeExecutionService.js';
import { AIService } from '../services/aiService.js';
import { isConnectedToDb } from '../config/db.js';
import { memorySubmissions, memoryProblems } from '../seed/seedProblems.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function createSubmission(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id || '660000000000000000000001';
    const { problemId, language, code, isRunOnly } = req.body;

    if (!problemId || !code) {
      return res.status(400).json({ message: 'Problem ID and code are required.' });
    }

    let problem: any = null;

    if (isConnectedToDb) {
      problem = await Problem.findById(problemId);
      if (!problem && !isNaN(Number(problemId))) {
        problem = await Problem.findOne({ number: Number(problemId) });
      }
    } else {
      problem = memoryProblems.find((p) => p._id === problemId || `mem_${p.number}` === problemId || p.number === Number(problemId));
    }

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found.' });
    }

    // 1. Safe Code Execution Abstraction
    const execResult = await CodeExecutionService.executeCode({
      language: language || 'javascript',
      code,
      examples: problem.examples || [],
    });

    if (isRunOnly) {
      return res.json({
        runResult: execResult,
      });
    }

    // 2. Trigger AI Logic Review
    const aiReviewResponse = await AIService.queryMentor({
      action: 'review',
      problem,
      userCode: code,
    });

    const aiReview = aiReviewResponse.reviewResult || {
      correctness: execResult.status === 'Accepted' ? 'Correct Algorithm & Output' : 'Logic Issue Detected',
      timeComplexity: problem.approaches[problem.approaches.length - 1]?.timeComplexity || 'O(N)',
      spaceComplexity: problem.approaches[problem.approaches.length - 1]?.spaceComplexity || 'O(1)',
      algorithm: problem.patterns[0] || 'Standard Logic',
      pattern: problem.patterns[0] || 'Optimal Approach',
      codeQuality: 'Well structured solution',
      potentialBugs: execResult.errorMessage ? [execResult.errorMessage] : [],
      improvements: ['Consider memory reuse where applicable'],
    };

    let submission: any = null;

    if (isConnectedToDb) {
      submission = await Submission.create({
        userId,
        problemId: problem._id,
        problemNumber: problem.number,
        language: language || 'javascript',
        code,
        status: execResult.status,
        runtimeMs: execResult.runtimeMs,
        memoryKb: execResult.memoryKb,
        testResults: execResult.testResults,
        aiReview,
      });

      // Update User Progress
      let pr = await UserProgress.findOne({ userId, problemId: problem._id });
      if (!pr) {
        pr = new UserProgress({
          userId,
          problemId: problem._id,
          problemNumber: problem.number,
          status: execResult.status === 'Accepted' ? 'Solved' : 'Attempted',
          attemptsCount: 1,
          lastAttemptedAt: new Date(),
          solvedAt: execResult.status === 'Accepted' ? new Date() : undefined,
        });
      } else {
        pr.attemptsCount += 1;
        pr.lastAttemptedAt = new Date();
        if (execResult.status === 'Accepted') {
          pr.status = 'Solved';
          pr.solvedAt = new Date();
        } else if (pr.status !== 'Solved') {
          pr.status = 'Attempted';
        }
      }

      if (!pr.personalCode) pr.personalCode = new Map();
      pr.personalCode.set(language || 'javascript', code);

      await pr.save();
    } else {
      submission = {
        _id: `sub_${Date.now()}`,
        userId,
        problemId,
        problemNumber: problem.number,
        language: language || 'javascript',
        code,
        status: execResult.status,
        runtimeMs: execResult.runtimeMs,
        memoryKb: execResult.memoryKb,
        testResults: execResult.testResults,
        aiReview,
        createdAt: new Date(),
      };
      memorySubmissions.push(submission);
    }

    return res.status(201).json({
      submission,
      execution: execResult,
    });
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message });
  }
}

export async function getSubmissions(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id || '660000000000000000000001';
    const problemId = req.query.problemId as string;

    if (isConnectedToDb) {
      const query: any = { userId };
      if (problemId) query.problemId = problemId;
      const submissions = await Submission.find(query).sort({ createdAt: -1 }).limit(50).lean();
      return res.json({ submissions });
    } else {
      let filtered = memorySubmissions.filter((s) => s.userId === userId);
      if (problemId) filtered = filtered.filter((s) => s.problemId === problemId);
      return res.json({ submissions: filtered });
    }
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message });
  }
}
