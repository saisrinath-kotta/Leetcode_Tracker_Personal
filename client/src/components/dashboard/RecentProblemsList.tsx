import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight, History } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { RecentProblemItem } from '../../types';

interface RecentProblemsListProps {
  problems: RecentProblemItem[];
}

export const RecentProblemsList: React.FC<RecentProblemsListProps> = ({ problems }) => {
  const navigate = useNavigate();

  if (!problems || problems.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-400" /> Recent Problems
        </h2>
        <EmptyState
          icon={<History className="w-6 h-6 text-muted-foreground" />}
          title="No recent activity"
          description="Start solving problems and your recent activity will appear here."
          actionLabel="Browse Problems"
          onAction={() => navigate('/problems')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-400" /> Recent Activity
        </h2>
        <button
          onClick={() => navigate('/problems')}
          className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
        >
          View All <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="border border-border/80 rounded-xl overflow-hidden bg-card divide-y divide-border/60 shadow-sm">
        {problems.map((problem) => (
          <div
            key={problem._id || problem.number}
            onClick={() => navigate(`/problems/${problem.number}`)}
            className="p-3.5 flex items-center justify-between gap-4 hover:bg-secondary/40 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="font-mono text-xs font-bold text-muted-foreground w-10 shrink-0">
                #{problem.number}
              </span>
              <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {problem.title}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Badge difficulty={problem.difficulty}>{problem.difficulty}</Badge>
              <Badge status={problem.userStatus}>{problem.userStatus}</Badge>
              {problem.lastAttemptedAt && (
                <span className="text-[10px] text-muted-foreground font-mono hidden sm:inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {problem.lastAttemptedAt}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
