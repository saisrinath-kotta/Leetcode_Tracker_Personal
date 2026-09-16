import mongoose, { Schema, Document } from 'mongoose';

export interface IExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface IApproach {
  name: string; // 'Brute Force' | 'Better' | 'Optimal'
  idea: string;
  steps: string[];
  timeComplexity: string;
  spaceComplexity: string;
  explanation: string;
  whyItWorks?: string;
  code?: {
    javascript?: string;
    python?: string;
    java?: string;
    cpp?: string;
    typescript?: string;
  };
}

export interface ISolution {
  language: string; // 'cpp' | 'java' | 'python' | 'javascript' | 'typescript'
  code: string;
  explanation: string;
  complexity: {
    time: string;
    space: string;
  };
}

export interface IYouTubeVideo {
  videoId: string;
  title: string;
  channel: string;
  url: string;
}

export interface IVisualExplanation {
  type: string; // 'array' | 'two-pointer' | 'sliding-window' | 'tree' | 'graph' | 'linked-list'
  title: string;
  steps: {
    step: number;
    description: string;
    state: any;
  }[];
}

export interface IProblem extends Document {
  number: number;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  patterns: string[];
  leetcodeUrl: string;
  description: string;
  simpleExplanation: string;
  inputDescription: string;
  outputDescription: string;
  constraints: string[];
  examples: IExample[];
  keyObservation: string;
  hints: (string | { level: number; text: string })[];
  visualExplanation?: IVisualExplanation;
  approaches: IApproach[];
  youtube?: IYouTubeVideo;
  youtubeResources?: IYouTubeVideo[];
  solutions: ISolution[];
  tags: string[];
  sourceType?: 'official-link' | 'original-educational-content' | 'curated';
  contentVersion?: number;
  learningObjective?: string;
  category?: string;
  relatedProblems?: number[];
  createdAt: Date;
  updatedAt: Date;
}

const ProblemSchema = new Schema<IProblem>(
  {
    number: { type: Number, required: true, unique: true, index: true },
    title: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true },
    difficulty: { type: String, required: true, enum: ['Easy', 'Medium', 'Hard'], index: true },
    topics: { type: [String], required: true, index: true },
    patterns: { type: [String], required: true, index: true },
    leetcodeUrl: { type: String, required: true },
    description: { type: String, required: true },
    simpleExplanation: { type: String, required: true },
    inputDescription: { type: String, required: true },
    outputDescription: { type: String, required: true },
    constraints: { type: [String], required: true },
    examples: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],
    keyObservation: { type: String, required: true },
    hints: { type: Schema.Types.Mixed, default: [] },
    visualExplanation: {
      type: { type: String },
      title: String,
      steps: [
        {
          step: Number,
          description: String,
          state: Schema.Types.Mixed,
        },
      ],
    },
    approaches: [
      {
        name: String,
        idea: String,
        steps: [String],
        timeComplexity: String,
        spaceComplexity: String,
        explanation: String,
        whyItWorks: String,
        code: Schema.Types.Mixed,
      },
    ],
    youtube: {
      videoId: String,
      title: String,
      channel: String,
      url: String,
    },
    youtubeResources: [
      {
        videoId: String,
        title: String,
        channel: String,
        url: String,
      },
    ],
    solutions: [
      {
        language: String,
        code: String,
        explanation: String,
        complexity: {
          time: String,
          space: String,
        },
      },
    ],
    tags: { type: [String], default: [], index: true },
    sourceType: { type: String, default: 'original-educational-content' },
    contentVersion: { type: Number, default: 1 },
    learningObjective: { type: String, default: '' },
    category: { type: String, default: '' },
    relatedProblems: { type: [Number], default: [] },
  },
  { timestamps: true }
);

export const Problem = mongoose.model<IProblem>('Problem', ProblemSchema);
