import React from 'react';
import { clsx } from 'clsx';
import { Difficulty, ProblemStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'easy' | 'medium' | 'hard' | 'status' | 'topic' | 'pattern' | 'outline' | 'default';
  difficulty?: Difficulty;
  status?: ProblemStatus;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  difficulty,
  status,
  className,
}) => {
  let badgeStyle = 'bg-secondary/60 text-muted-foreground border-border';

  if (difficulty === 'Easy' || variant === 'easy') {
    badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (difficulty === 'Medium' || variant === 'medium') {
    badgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  } else if (difficulty === 'Hard' || variant === 'hard') {
    badgeStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  } else if (status === 'Solved') {
    badgeStyle = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
  } else if (status === 'Attempted') {
    badgeStyle = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
  } else if (status === 'Review') {
    badgeStyle = 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
  } else if (variant === 'topic') {
    badgeStyle = 'bg-sky-500/10 text-sky-400 border-sky-500/20';
  } else if (variant === 'pattern') {
    badgeStyle = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
  } else if (variant === 'outline') {
    badgeStyle = 'bg-transparent text-foreground border-border';
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        badgeStyle,
        className
      )}
    >
      {children}
    </span>
  );
};
