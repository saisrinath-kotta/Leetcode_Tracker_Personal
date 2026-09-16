import mongoose, { Schema, Document } from 'mongoose';

export interface IUserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultLanguage: 'javascript' | 'typescript' | 'python' | 'java' | 'cpp';
  dailyGoal: number;
  editorFontSize: number;
  editorTheme: 'vs-dark' | 'light';
}

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  preferences: IUserPreferences;
  currentStreak: number;
  bestStreak: number;
  lastActiveDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    preferences: {
      theme: { type: String, default: 'dark' },
      defaultLanguage: { type: String, default: 'javascript' },
      dailyGoal: { type: Number, default: 2 },
      editorFontSize: { type: Number, default: 14 },
      editorTheme: { type: String, default: 'vs-dark' },
    },
    currentStreak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
