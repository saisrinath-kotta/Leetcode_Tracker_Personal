import mongoose, { Schema, Document } from 'mongoose';

export interface IPracticeSession extends Document {
  userId: mongoose.Types.ObjectId;
  topics: string[];
  difficulty?: string;
  patterns: string[];
  problems: {
    problemId: mongoose.Types.ObjectId;
    problemNumber: number;
    title: string;
    difficulty: string;
    status: 'Pending' | 'Attempted' | 'Solved';
    hintsUsed: number;
    timeSpentSeconds: number;
  }[];
  totalTimeSeconds: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PracticeSessionSchema = new Schema<IPracticeSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    topics: [String],
    difficulty: String,
    patterns: [String],
    problems: [
      {
        problemId: { type: Schema.Types.ObjectId, ref: 'Problem', required: true },
        problemNumber: Number,
        title: String,
        difficulty: String,
        status: { type: String, enum: ['Pending', 'Attempted', 'Solved'], default: 'Pending' },
        hintsUsed: { type: Number, default: 0 },
        timeSpentSeconds: { type: Number, default: 0 },
      },
    ],
    totalTimeSeconds: { type: Number, default: 0 },
    completedAt: Date,
  },
  { timestamps: true }
);

export const PracticeSession = mongoose.model<IPracticeSession>('PracticeSession', PracticeSessionSchema);
