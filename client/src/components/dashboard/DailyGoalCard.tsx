import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface DailyGoalCardProps {
  completed: number;
  total: number;
}

export const DailyGoalCard: React.FC<DailyGoalCardProps> = ({ completed, total }) => {
  const navigate = useNavigate();
  const percentage = Math.min(100, Math.round((completed / Math.max(1, total)) * 100));
  const remaining = Math.max(0, total - completed);

  return (
    <Card className="p-6 space-y-4 border-sky-500/20 bg-sky-950/5 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
            <Target className="w-4 h-4" /> Today's Goal
          </span>
          <span className="text-xs font-mono font-bold text-sky-400">
            {completed} / {total} Completed
          </span>
        </div>

        <div className="text-3xl font-bold font-mono text-foreground tracking-tight">
          {percentage}%
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {remaining > 0 ? (
            <>
              <strong>{remaining} more problem{remaining > 1 ? 's' : ''}</strong> to reach today's goal.
            </>
          ) : (
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Daily goal achieved! Keep pushing.
            </span>
          )}
        </p>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full mt-2"
        onClick={() => navigate('/practice')}
        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
      >
        Start Practice
      </Button>
    </Card>
  );
};
