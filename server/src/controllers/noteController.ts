import { Response } from 'express';
import { Note } from '../models/Note.js';
import { Problem } from '../models/Problem.js';
import { isConnectedToDb } from '../config/db.js';
import { memoryNotes } from '../seed/seedProblems.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function getNotes(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.json({ notes: [] });
    }

    if (isConnectedToDb) {
      const notes = await Note.find({ userId }).populate('problemId', 'number title difficulty topics').lean();
      return res.json({ notes });
    } else {
      return res.json({ notes: [] });
    }
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message });
  }
}

export async function getNoteByProblemId(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.json({ note: null });
    }
    const { problemId } = req.params;

    if (isConnectedToDb) {
      const note = await Note.findOne({ userId, problemId }).lean();
      return res.json({ note: note || null });
    } else {
      return res.json({ note: null });
    }
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message });
  }
}

export async function updateNote(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const { problemId } = req.params;
    const { confused, observation, mistakes, remember } = req.body;

    if (isConnectedToDb) {
      let problem = await Problem.findById(problemId);
      if (!problem && !isNaN(Number(problemId))) {
        problem = await Problem.findOne({ number: Number(problemId) });
      }
      if (!problem) return res.status(404).json({ message: 'Problem not found' });

      const note = await Note.findOneAndUpdate(
        { userId, problemId: problem._id },
        {
          userId,
          problemId: problem._id,
          problemNumber: problem.number,
          confused: confused || '',
          observation: observation || '',
          mistakes: mistakes || '',
          remember: remember || '',
        },
        { new: true, upsert: true }
      );
      return res.json({ note });
    } else {
      const key = `${userId}_${problemId}`;
      const note = {
        userId,
        problemId,
        confused: confused || '',
        observation: observation || '',
        mistakes: mistakes || '',
        remember: remember || '',
        updatedAt: new Date(),
      };
      memoryNotes.set(key, note);
      return res.json({ note });
    }
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message });
  }
}

export async function deleteNote(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const { id } = req.params;

    if (isConnectedToDb) {
      let note = await Note.findOneAndDelete({ _id: id, userId });
      if (!note) {
        // Try searching by problemId or problem number if valid
        note = await Note.findOneAndDelete({ problemId: id, userId });
      }
      if (!note && !isNaN(Number(id))) {
        const problem = await Problem.findOne({ number: Number(id) });
        if (problem) {
          note = await Note.findOneAndDelete({ problemId: problem._id, userId });
        }
      }
      if (!note) {
        const exists = await Note.findById(id);
        if (exists) {
          return res.status(403).json({ message: 'Forbidden: You do not own this note.' });
        }
        return res.status(404).json({ message: 'Note not found' });
      }
      return res.json({ message: 'Note deleted successfully', noteId: note._id });
    } else {
      return res.json({ message: 'Note deleted successfully' });
    }
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message });
  }
}
