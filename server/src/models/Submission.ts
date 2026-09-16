import mongoose, { Schema, Document } from 'mongoose';

export interface ITestResult {
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  runtimeMs?: number;
}

export interface IAIReview {
  correctness: string;
  timeComplexity: string;
  spaceComplexity: string;
  algorithm: string;
  pattern: string;
  codeQuality: string;
  potentialBugs: string[];
  improvements: string[];
}

export interface ISubmission extends Document {
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  problemNumber: number;
  language: string;
  code: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compile Error';
  runtimeMs?: number;
  memoryKb?: number;
  testResults: ITestResult[];
  aiReview?: IAIReview;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    problemId: { type: Schema.Types.ObjectId, ref: 'Problem', required: true, index: true },
    problemNumber: { type: Number, required: true, index: true },
    language: { type: String, required: true },
    code: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compile Error'],
      index: true,
    },
    runtimeMs: Number,
    memoryKb: Number,
    testResults: [
      {
        passed: Boolean,
        input: String,
        expectedOutput: String,
        actualOutput: String,
        runtimeMs: Number,
      },
    ],
    aiReview: {
      correctness: String,
      timeComplexity: String,
      spaceComplexity: String,
      algorithm: String,
      pattern: String,
      codeQuality: String,
      potentialBugs: [String],
      improvements: [String],
    },
  },
  { timestamps: true }
);

export const Submission = mongoose.model<ISubmission>('Submission', SubmissionSchema);
