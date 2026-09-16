import { Response } from 'express';
import { Problem } from '../models/Problem.js';
import { UserProgress } from '../models/UserProgress.js';
import { Submission } from '../models/Submission.js';
import { isConnectedToDb } from '../config/db.js';
import { memoryProblems, memoryProgress, memorySubmissions } from '../seed/seedProblems.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function getDashboard(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;

    let totalProblemsCount = 500;
    let activeDatabaseCount = 500;
    let solvedCount = 0;
    let attemptedCount = 0;
    let inProgressCount = 0;
    let currentStreak = 0;
    let bestStreak = 0;
    let dailyGoal = 2;

    let easyTotal = 239;
    let easySolved = 0;
    let mediumTotal = 169;
    let mediumSolved = 0;
    let hardTotal = 92;
    let hardSolved = 0;

    let totalSubmissions = 0;
    let acceptedSubmissions = 0;
    let accuracyRate = 0;

    let activeProblem: any = null;
    let recentProblems: any[] = [];
    let reviewQueue: any[] = [];
    let topicProgress: any[] = [];

    const TOPIC_LIST = [
      'Arrays',
      'Strings',
      'Linked Lists',
      'Stack',
      'Queue',
      'Trees',
      'Graphs',
      'Dynamic Programming',
      'Greedy',
      'Backtracking',
    ];

    if (isConnectedToDb) {
      activeDatabaseCount = await Problem.countDocuments();
      totalProblemsCount = activeDatabaseCount || 500;

      easyTotal = await Problem.countDocuments({ difficulty: 'Easy' });
      mediumTotal = await Problem.countDocuments({ difficulty: 'Medium' });
      hardTotal = await Problem.countDocuments({ difficulty: 'Hard' });

      const progressList = userId ? await UserProgress.find({ userId }).populate('problemId').lean() : [];

      solvedCount = progressList.filter((p) => p.status === 'Solved').length;
      attemptedCount = progressList.filter((p) => p.status === 'Attempted').length;
      inProgressCount = progressList.filter((p) => p.status === 'Attempted' || (p.confidence > 0 && p.confidence < 4)).length;

      easySolved = progressList.filter((p) => p.status === 'Solved' && (p.problemId as any)?.difficulty === 'Easy').length;
      mediumSolved = progressList.filter((p) => p.status === 'Solved' && (p.problemId as any)?.difficulty === 'Medium').length;
      hardSolved = progressList.filter((p) => p.status === 'Solved' && (p.problemId as any)?.difficulty === 'Hard').length;

      // Submissions accuracy calculation
      totalSubmissions = userId ? await Submission.countDocuments({ userId }) : 0;
      acceptedSubmissions = userId ? await Submission.countDocuments({ userId, status: 'Accepted' }) : 0;
      accuracyRate = totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0;

      // Active problem: most recently attempted
      const sortedByActivity = [...progressList].sort((a, b) => {
        const da = new Date(a.lastAttemptedAt || a.updatedAt || 0).getTime();
        const db = new Date(b.lastAttemptedAt || b.updatedAt || 0).getTime();
        return db - da;
      });

      if (sortedByActivity.length > 0 && sortedByActivity[0].problemId) {
        const pr = sortedByActivity[0];
        activeProblem = {
          ...pr.problemId,
          userStatus: pr.status,
          userConfidence: pr.confidence,
          lastAttemptedAt: pr.lastAttemptedAt,
        };
      }

      // Recent problems
      recentProblems = sortedByActivity.slice(0, 5).map((pr) => ({
        ...pr.problemId,
        userStatus: pr.status,
        userConfidence: pr.confidence,
        lastAttemptedAt: pr.lastAttemptedAt,
      }));

      // Review recommendations
      const reviewFilter = progressList.filter((pr) => pr.confidence <= 3 || pr.status === 'Attempted' || pr.mistakes);
      reviewQueue = reviewFilter.slice(0, 4).map((pr) => ({
        ...pr.problemId,
        userConfidence: pr.confidence,
        lastAttemptedAt: pr.lastAttemptedAt,
        mistakes: pr.mistakes,
        reason: pr.confidence <= 2 ? 'Low Confidence' : pr.mistakes ? 'Previous Mistakes' : 'Review Recommended',
      }));

      // Topic Progress calculation
      const allProblems = await Problem.find({}, 'topics difficulty').lean();
      topicProgress = TOPIC_LIST.map((topicName) => {
        const matchingProblems = allProblems.filter((p) =>
          p.topics.some((t) => t.toLowerCase() === topicName.toLowerCase() || t.toLowerCase().includes(topicName.toLowerCase().replace('s', '')))
        );
        const totalInTopic = matchingProblems.length || 5;
        const matchingIds = new Set(matchingProblems.map((p) => p._id.toString()));
        const solvedInTopic = progressList.filter((pr) => pr.status === 'Solved' && matchingIds.has(pr.problemId?._id?.toString() || '')).length;

        return {
          name: topicName,
          total: totalInTopic,
          solved: solvedInTopic,
          percentage: Math.round((solvedInTopic / Math.max(1, totalInTopic)) * 100),
        };
      });
    } else {
      // Memory Fallback
      activeProblem = {
        number: 287,
        title: 'Find the Duplicate Number',
        difficulty: 'Medium',
        topics: ['Array', 'Two Pointers'],
        patterns: ['Fast/Slow Pointers'],
        userStatus: 'Attempted',
        userConfidence: 3,
        _id: 'mem_287',
      };

      recentProblems = [
        { number: 287, title: 'Find the Duplicate Number', difficulty: 'Medium', topics: ['Array', 'Two Pointers'], userStatus: 'Attempted' },
        { number: 1, title: 'Two Sum', difficulty: 'Easy', topics: ['Array', 'Hash Table'], userStatus: 'Solved' },
        { number: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', topics: ['String', 'Sliding Window'], userStatus: 'Not Started' },
      ];

      reviewQueue = [
        { number: 287, title: 'Find the Duplicate Number', difficulty: 'Medium', confidence: 3, reason: 'Low Confidence (3/5)', lastSolved: '2 days ago' },
        { number: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', confidence: 2, reason: 'Attempted 1 time', lastSolved: '4 days ago' },
        { number: 141, title: 'Linked List Cycle', difficulty: 'Easy', confidence: 2, reason: 'Previous Mistakes', lastSolved: '7 days ago' },
      ];

      topicProgress = TOPIC_LIST.map((name, i) => ({
        name,
        total: 10 + i * 2,
        solved: i === 0 ? 3 : i === 1 ? 2 : i === 2 ? 2 : 1,
        percentage: Math.round(((i === 0 ? 3 : 1) / (10 + i * 2)) * 100),
      }));
    }

    // Default fallback for active problem if none recorded yet
    if (!activeProblem && memoryProblems.length > 0) {
      activeProblem = memoryProblems[0];
    }

    const completionPercentage = Math.round((solvedCount / totalProblemsCount) * 100);

    return res.json({
      metrics: {
        totalProblems: totalProblemsCount,
        activeDatabaseCount,
        solved: solvedCount,
        attempted: attemptedCount,
        inProgress: inProgressCount,
        completionPercentage,
        currentStreak,
        bestStreak,
        dailyGoal,
        difficultyBreakdown: {
          easy: { solved: easySolved, total: easyTotal },
          medium: { solved: mediumSolved, total: mediumTotal },
          hard: { solved: hardSolved, total: hardTotal },
        },
        submissionMetrics: {
          totalSubmissions,
          acceptedSubmissions,
          accuracyRate,
        },
      },
      continueLearning: activeProblem,
      topicProgress,
      recentProblems,
      problemsToReview: reviewQueue,
    });
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message });
  }
}
