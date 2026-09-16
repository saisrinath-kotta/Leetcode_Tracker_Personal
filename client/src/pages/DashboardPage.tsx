import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  Target,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Sparkles,
  BarChart2,
  Award,
} from 'lucide-react';
import { apiRequest } from '../services/api';
import { DashboardData } from '../types';
import { Button } from '../components/ui/Button';
import { DashboardSkeleton } from '../components/dashboard/DashboardSkeleton';
import { StatsCard } from '../components/dashboard/StatsCard';
import { ContinueLearningCard } from '../components/dashboard/ContinueLearningCard';
import { DailyGoalCard } from '../components/dashboard/DailyGoalCard';
import { TopicProgressGrid } from '../components/dashboard/TopicProgressGrid';
import { RecentProblemsList } from '../components/dashboard/RecentProblemsList';
import { ReviewQueueSection } from '../components/dashboard/ReviewQueueSection';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [dashRes, userRes] = await Promise.all([
          apiRequest('/dashboard').catch(() => null),
          apiRequest('/auth/me').catch(() => null),
        ]);

        const userObj = userRes?.user || { username: 'Developer' };

        if (dashRes) {
          setData({
            user: { name: userObj.username, username: userObj.username },
            metrics: {
              totalProblems: dashRes.metrics?.totalProblems || 500,
              solved: dashRes.metrics?.solved ?? 0,
              attempted: dashRes.metrics?.attempted ?? 0,
              inProgress: dashRes.metrics?.inProgress ?? 0,
              completionPercentage: dashRes.metrics?.completionPercentage ?? 0,
              currentStreak: dashRes.metrics?.currentStreak ?? 0,
              bestStreak: dashRes.metrics?.bestStreak ?? 0,
              dailyGoalSolved: dashRes.metrics?.solved ? Math.min(dashRes.metrics.solved, dashRes.metrics?.dailyGoal || 2) : 0,
              dailyGoalTotal: dashRes.metrics?.dailyGoal || 2,
            },
            continueLearning: dashRes.continueLearning || null,
            topicProgress: dashRes.topicProgress || [],
            recentProblems: dashRes.recentProblems || [],
            problemsToReview: dashRes.problemsToReview || [],
          });
        }
      } catch (err) {
        console.error('Failed loading dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (isLoading || !data) {
    return <DashboardSkeleton />;
  }

  const { metrics, continueLearning, topicProgress, recentProblems, problemsToReview } = data;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Good morning, <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{data.user.name}</span> 👋
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Keep building your Data Structures & Algorithms skills. Target: Master 500 LeetCode problems.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="accent"
            size="sm"
            onClick={() => navigate('/practice')}
            leftIcon={<Target className="w-4 h-4" />}
          >
            Start Practice
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/problems')}
            leftIcon={<BookOpen className="w-4 h-4" />}
          >
            Browse Library
          </Button>
        </div>
      </div>

      {/* Reusable Statistics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        <StatsCard
          label="Total Problems"
          value={metrics.totalProblems}
          subtext="500 Catalog Capacity"
          icon={<BookOpen className="w-4 h-4 text-indigo-400" />}
          variant="indigo"
        />

        <StatsCard
          label="Solved"
          value={metrics.solved}
          subtext="Accepted Solutions"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          variant="emerald"
        />

        <StatsCard
          label="Attempted"
          value={metrics.attempted}
          subtext="Active Problems"
          icon={<TrendingUp className="w-4 h-4 text-amber-400" />}
          variant="amber"
        />

        <StatsCard
          label="Completion"
          value={`${metrics.completionPercentage}%`}
          subtext="Progress Target"
          icon={<BarChart2 className="w-4 h-4 text-purple-400" />}
          variant="purple"
        />

        <StatsCard
          label="Current Streak"
          value={`${metrics.currentStreak} days`}
          subtext={`Best: ${metrics.bestStreak} days`}
          icon={<Flame className="w-4 h-4 text-orange-400" />}
          variant="orange"
        />

        <StatsCard
          label="Best Streak"
          value={`${metrics.bestStreak} days`}
          subtext="All-time Record"
          icon={<Award className="w-4 h-4 text-purple-400" />}
          variant="purple"
        />

        <StatsCard
          label="Daily Goal"
          value={`${metrics.dailyGoalSolved} / ${metrics.dailyGoalTotal}`}
          subtext="Today's Target"
          icon={<Target className="w-4 h-4 text-sky-400" />}
          variant="sky"
        />
      </div>

      {/* Featured Continue Learning & Daily Goal Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ContinueLearningCard problem={continueLearning} />
        </div>
        <div className="lg:col-span-1">
          <DailyGoalCard completed={metrics.dailyGoalSolved} total={metrics.dailyGoalTotal} />
        </div>
      </div>

      {/* Main Grid: Topic Progress & Side Review Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left (2 Cols): Topic Progress & Recent Activity */}
        <div className="lg:col-span-2 space-y-8">
          <TopicProgressGrid topics={topicProgress} />
          <RecentProblemsList problems={recentProblems} />
        </div>

        {/* Right (1 Col): Review Queue Section */}
        <div className="lg:col-span-1 space-y-8">
          <ReviewQueueSection items={problemsToReview} />
        </div>
      </div>
    </div>
  );
};
