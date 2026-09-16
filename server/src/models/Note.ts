import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  problemNumber: number;
  confused: string;
  observation: string;
  mistakes: string;
  remember: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    problemId: { type: Schema.Types.ObjectId, ref: 'Problem', required: true, index: true },
    problemNumber: { type: Number, required: true, index: true },
    confused: { type: String, default: '' },
    observation: { type: String, default: '' },
    mistakes: { type: String, default: '' },
    remember: { type: String, default: '' },
  },
  { timestamps: true }
);

NoteSchema.index({ userId: 1, problemId: 1 }, { unique: true });

export const Note = mongoose.model<INote>('Note', NoteSchema);
