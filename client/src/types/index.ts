export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type ProblemStatus = 'Not Started' | 'Attempted' | 'Solved' | 'Review';

export interface IExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface IApproach {
  name: string;
  idea: string;
  steps: string[];
  timeComplexity: string;
  spaceComplexity: string;
  explanation: string;
  whyItWorks?: string;
}

export interface ISolution {
  language: 'javascript' | 'typescript' | 'python' | 'java' | 'cpp';
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

export interface IVisualStep {
  step: number;
  description: string;
  state: any;
}

export interface IVisualExplanation {
  type: string;
  title: string;
  steps: IVisualStep[];
}

export interface Problem {
  _id: string;
  number: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
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
  hints: string[];
  visualExplanation?: IVisualExplanation;
  approaches: IApproach[];
  youtube?: IYouTubeVideo;
  solutions: ISolution[];
  tags: string[];
  userStatus?: ProblemStatus;
  userConfidence?: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    defaultLanguage: 'javascript' | 'typescript' | 'python' | 'java' | 'cpp';
    dailyGoal: number;
    editorFontSize: number;
    editorTheme: 'vs-dark' | 'light';
  };
}

export interface UserProgress {
  userId: string;
  problemId: string;
  problemNumber: number;
  status: ProblemStatus;
  confidence: number;
  attemptsCount: number;
  hintsUsed: number;
  solvedAt?: string;
  lastAttemptedAt?: string;
  notes?: string;
  mistakes?: string;
  personalCode?: Record<string, string>;
}

export interface Submission {
  _id: string;
  userId: string;
  problemId: string;
  problemNumber: number;
  language: string;
  code: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compile Error';
  runtimeMs?: number;
  memoryKb?: number;
  testResults: {
    passed: boolean;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    runtimeMs?: number;
  }[];
  aiReview?: {
    correctness: string;
    timeComplexity: string;
    spaceComplexity: string;
    algorithm: string;
    pattern: string;
    codeQuality: string;
    potentialBugs: string[];
    improvements: string[];
  };
  createdAt: string;
}

// Phase 2 Dashboard Data Structure
export interface TopicProgressItem {
  name: string;
  solved: number;
  total: number;
  percentage: number;
}

export interface RecentProblemItem {
  _id: string;
  number: number;
  title: string;
  difficulty: Difficulty;
  topics: string[];
  userStatus: ProblemStatus;
  lastAttemptedAt?: string;
}

export interface ReviewItem {
  _id: string;
  number: number;
  title: string;
  difficulty: Difficulty;
  userConfidence: number;
  lastSolvedAt?: string;
  reason: string;
}

export interface DashboardMetrics {
  totalProblems: number;
  solved: number;
  attempted: number;
  inProgress: number;
  completionPercentage: number;
  currentStreak: number;
  bestStreak: number;
  dailyGoalSolved: number;
  dailyGoalTotal: number;
}

export interface DashboardData {
  user: {
    name: string;
    username: string;
  };
  metrics: DashboardMetrics;
  continueLearning?: Problem & {
    progressPercentage?: number;
    lastAttemptedText?: string;
  };
  topicProgress: TopicProgressItem[];
  recentProblems: RecentProblemItem[];
  problemsToReview: ReviewItem[];
}
