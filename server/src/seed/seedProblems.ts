import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { connectDB, isConnectedToDb } from '../config/db.js';
import { Problem } from '../models/Problem.js';
import { User } from '../models/User.js';
import { UserProgress } from '../models/UserProgress.js';
import { allCatalogProblems } from './problems/index.js';

export let memoryProblems: any[] = allCatalogProblems;
export let memoryUser: any = null;
export let memoryProgress: Map<string, any> = new Map();
export let memorySubmissions: any[] = [];
export let memoryNotes: Map<string, any> = new Map();

export async function seedData(options: { mode?: 'full' | 'dev' } = {}) {
  const isDevMode = options.mode === 'dev';
  const dataset = isDevMode ? allCatalogProblems.slice(0, 20) : allCatalogProblems;

  memoryProblems = dataset;

  if (isConnectedToDb) {
    try {
      // Idempotent upsert operation using bulkWrite (Never deletes existing collections/data)
      const bulkOps = dataset.map((p) => ({
        updateOne: {
          filter: { number: p.number },
          update: { $set: p },
          upsert: true,
        },
      }));

      const result = await Problem.bulkWrite(bulkOps);
      console.log(`[Seed] Idempotently synced ${dataset.length} problems with MongoDB Atlas.`);
      console.log(`[Seed Details] Upserted (New): ${result.upsertedCount}, Modified: ${result.modifiedCount}, Matched: ${result.matchedCount}`);

      // Seed Default Demo User if not present
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('password123', salt);

      let user = await User.findOne({ email: 'demo@dsamaster.dev' });
      if (!user) {
        user = await User.create({
          _id: '660000000000000000000001',
          username: 'demo_user',
          email: 'demo@dsamaster.dev',
          passwordHash,
          currentStreak: 5,
          bestStreak: 12,
          preferences: {
            theme: 'dark',
            defaultLanguage: 'javascript',
            dailyGoal: 2,
            editorFontSize: 14,
            editorTheme: 'vs-dark',
          },
        });
        console.log('[Seed] Created default demo user: demo@dsamaster.dev / password123');
      }

      // Seed initial sample user progress safely using upserts
      const p287 = await Problem.findOne({ number: 287 });
      if (p287 && user) {
        await UserProgress.findOneAndUpdate(
          { userId: user._id, problemId: p287._id },
          {
            userId: user._id,
            problemId: p287._id,
            problemNumber: 287,
            status: 'Attempted',
            confidence: 3,
            attemptsCount: 2,
            hintsUsed: 1,
            lastAttemptedAt: new Date(Date.now() - 2 * 86400000),
            notes: 'Need to review Floyds cycle entrance mathematics formula.',
          },
          { upsert: true }
        );
      }

      const p1 = await Problem.findOne({ number: 1 });
      if (p1 && user) {
        await UserProgress.findOneAndUpdate(
          { userId: user._id, problemId: p1._id },
          {
            userId: user._id,
            problemId: p1._id,
            problemNumber: 1,
            status: 'Solved',
            confidence: 5,
            attemptsCount: 1,
            hintsUsed: 0,
            solvedAt: new Date(Date.now() - 86400000),
            lastAttemptedAt: new Date(Date.now() - 86400000),
          },
          { upsert: true }
        );
      }
    } catch (err) {
      console.warn(`[Seed] Mongo seed warning: ${(err as Error).message}`);
    }
  } else {
    console.log(`[Seed] In-Memory mode active. Seeded ${dataset.length} problems in memory.`);
  }
}

if (process.argv[1] && process.argv[1].endsWith('seedProblems.ts')) {
  const isDev = process.argv.includes('--dev');
  connectDB().then(() => {
    seedData({ mode: isDev ? 'dev' : 'full' }).then(() => {
      console.log('[Seed Command] Completed successfully.');
      process.exit(0);
    });
  });
}
