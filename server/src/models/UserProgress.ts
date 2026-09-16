import mongoose, { Schema, Document } from 'mongoose';

export type ProblemStatus = 'Not Started' | 'Attempted' | 'Solved' | 'Review';

export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  problemNumber: number;
  status: ProblemStatus;
  confidence: number; // 1-5
  attemptsCount: number;
  hintsUsed: number;
  solvedAt?: Date;
  lastAttemptedAt?: Date;
  lastReviewedAt?: Date;
  notes?: string;
  mistakes?: string;
  personalCode?: Map<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const UserProgressSchema = new Schema<IUserProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    problemId: { type: Schema.Types.ObjectId, ref: 'Problem', required: true, index: true },
    problemNumber: { type: Number, required: true, index: true },
    status: {
      type: String,
      required: true,
      enum: ['Not Started', 'Attempted', 'Solved', 'Review'],
      default: 'Not Started',
      index: true,
    },
    confidence: { type: Number, default: 0, min: 0, max: 5 },
    attemptsCount: { type: Number, default: 0 },
    hintsUsed: { type: Number, default: 0 },
    solvedAt: { type: Date },
    lastAttemptedAt: { type: Date },
    lastReviewedAt: { type: Date },
    notes: { type: String, default: '' },
    mistakes: { type: String, default: '' },
    personalCode: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { timestamps: true }
);

UserProgressSchema.index({ userId: 1, problemId: 1 }, { unique: true });

export const UserProgress = mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);
