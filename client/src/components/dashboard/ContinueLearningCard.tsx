import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Problem } from '../../types';

interface ContinueLearningCardProps {
  problem?: Problem & {
    progressPercentage?: number;
    lastAttemptedText?: string;
  };
}

export const ContinueLearningCard: React.FC<ContinueLearningCardProps> = ({ problem }) => {
  const navigate = useNavigate();

  if (!problem) {
    return (
      <Card className="p-6 border-indigo-500/30 bg-card">
        <div className="flex flex-col items-center justify-center text-center space-y-3 py-4">
          <Sparkles className="w-8 h-8 text-indigo-400" />
          <h3 className="text-sm font-semibold text-foreground">Ready to start your DSA journey?</h3>
          <p className="text-xs text-muted-foreground max-w-md">
            Pick your first problem from the library to kickstart your practice routine.
          </p>
          <Button variant="primary" size="sm" onClick={() => navigate('/problems')}>
            Browse Problems
          </Button>
        </div>
      </Card>
    );
  }

  const progressPct = problem.progressPercentage ?? 70;
  const lastAttempted = problem.lastAttemptedText ?? 'Yesterday';

  return (
    <Card className="p-6 border-indigo-500/40 bg-gradient-to-br from-indigo-950/40 via-card to-card relative overflow-hidden space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Continue Learning
        </span>
        <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" /> Last attempted: {lastAttempted}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-xs font-bold text-muted-foreground">#{problem.number}</span>
          <h2 className="text-lg font-bold text-foreground hover:text-indigo-300 transition-colors cursor-pointer" onClick={() => navigate(`/problems/${problem.number}`)}>
            {problem.title}
          </h2>
          <Badge difficulty={problem.difficulty}>{problem.difficulty}</Badge>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          {problem.topics?.map((topic) => (
            <Badge key={topic} variant="topic">
              {topic}
            </Badge>
          ))}
          {problem.patterns?.map((pattern) => (
            <Badge key={pattern} variant="pattern">
              {pattern}
            </Badge>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-xs font-mono text-muted-foreground">
          <span>Solution Progress</span>
          <span className="text-indigo-400 font-semibold">{progressPct}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <Button
          variant="accent"
          size="md"
          onClick={() => navigate(`/problems/${problem.number}`)}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Continue Problem
        </Button>
      </div>
    </Card>
  );
};
