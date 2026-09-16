import React from 'react';
import { Card } from '../ui/Card';
import { clsx } from 'clsx';

interface StatsCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  variant?: 'indigo' | 'emerald' | 'amber' | 'purple' | 'orange' | 'sky' | 'default';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  subtext,
  icon,
  variant = 'default',
}) => {
  const variantStyles = {
    indigo: 'border-indigo-500/20 bg-indigo-950/5 text-indigo-400',
    emerald: 'border-emerald-500/20 bg-emerald-950/5 text-emerald-400',
    amber: 'border-amber-500/20 bg-amber-950/5 text-amber-400',
    purple: 'border-purple-500/20 bg-purple-950/5 text-purple-400',
    orange: 'border-orange-500/20 bg-orange-950/5 text-orange-400',
    sky: 'border-sky-500/20 bg-sky-950/5 text-sky-400',
    default: 'border-border bg-card text-foreground',
  };

  return (
    <Card className={clsx('p-4 space-y-2 relative overflow-hidden', variantStyles[variant])}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        {icon && <div className="shrink-0">{icon}</div>}
      </div>

      <div className="text-2xl font-bold font-mono tracking-tight text-foreground flex items-center gap-1.5">
        {value}
      </div>

      {subtext && <span className="text-[10px] text-muted-foreground block truncate">{subtext}</span>}
    </Card>
  );
};
