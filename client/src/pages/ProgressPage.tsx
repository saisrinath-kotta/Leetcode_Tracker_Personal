import React, { useEffect, useState } from 'react';
import { BarChart2, Flame, PieChart, Loader2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { apiRequest } from '../services/api';

export const ProgressPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function loadProgress() {
      try {
        setLoading(true);
        const res = await apiRequest('/dashboard');
        setData(res);
      } catch (err: any) {
        setError(err.message || 'Failed to load progress metrics');
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
        <span>Loading analytics...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 border border-destructive/30 rounded-xl bg-destructive/5 text-destructive text-sm text-center">
        {error || 'Unable to display progress data.'}
      </div>
    );
  }

  const { metrics, topicProgress } = data;
  const diff = metrics?.difficultyBreakdown || {
    easy: { solved: 0, total: 239 },
    medium: { solved: 0, total: 169 },
    hard: { solved: 0, total: 92 },
  };

  const easyPct = Math.round((diff.easy.solved / Math.max(1, diff.easy.total)) * 100);
  const mediumPct = Math.round((diff.medium.solved / Math.max(1, diff.medium.total)) * 100);
  const hardPct = Math.round((diff.hard.solved / Math.max(1, diff.hard.total)) * 100);

  const totalTopics = topicProgress?.length || 10;
  const exploredTopics = topicProgress?.filter((t: any) => t.solved > 0).length || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-border/60 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-indigo-400" /> Progress Analytics
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Real-time metrics tracking your LeetCode problem mastery, accuracy rate, and topic coverage.
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 space-y-2 border-emerald-500/20 bg-emerald-950/5">
          <span className="text-xs font-semibold text-muted-foreground uppercase">Total Solved</span>
          <div className="text-3xl font-bold font-mono text-emerald-400">
            {metrics?.solved || 0} / {metrics?.totalProblems || 500}
          </div>
          <span className="text-xs text-muted-foreground block">{metrics?.completionPercentage || 0}% Catalog Completed</span>
        </Card>

        <Card className="p-5 space-y-2 border-indigo-500/20 bg-indigo-950/5">
          <span className="text-xs font-semibold text-muted-foreground uppercase">Accuracy Rate</span>
          <div className="text-3xl font-bold font-mono text-indigo-400">
            {metrics?.submissionMetrics?.accuracyRate ?? 100}%
          </div>
          <span className="text-xs text-emerald-400 font-medium block">
            {metrics?.submissionMetrics?.acceptedSubmissions || 0} Accepted Submissions
          </span>
        </Card>

        <Card className="p-5 space-y-2 border-amber-500/20 bg-amber-950/5">
          <span className="text-xs font-semibold text-muted-foreground uppercase">Current Streak</span>
          <div className="text-3xl font-bold font-mono text-amber-400 flex items-center gap-1">
            {metrics?.currentStreak || 0} Days <Flame className="w-6 h-6 fill-amber-400" />
          </div>
          <span className="text-xs text-muted-foreground block">Best Streak: {metrics?.bestStreak || 0} Days</span>
        </Card>

        <Card className="p-5 space-y-2 border-purple-500/20 bg-purple-950/5">
          <span className="text-xs font-semibold text-muted-foreground uppercase">Topics Explored</span>
          <div className="text-3xl font-bold font-mono text-purple-400">
            {exploredTopics} / {totalTopics}
          </div>
          <span className="text-xs text-muted-foreground block">Core DSA Categories</span>
        </Card>
      </div>

      {/* Difficulty Breakdown */}
      <Card className="p-6 space-y-4">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <PieChart className="w-5 h-5 text-indigo-400" /> Difficulty Distribution
        </h3>

        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-emerald-400">Easy ({diff.easy.solved} Solved)</span>
              <span>{diff.easy.solved} / {diff.easy.total}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${easyPct}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-amber-400">Medium ({diff.medium.solved} Solved)</span>
              <span>{diff.medium.solved} / {diff.medium.total}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${mediumPct}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-rose-400">Hard ({diff.hard.solved} Solved)</span>
              <span>{diff.hard.solved} / {diff.hard.total}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${hardPct}%` }} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

