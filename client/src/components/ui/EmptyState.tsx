import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <Inbox className="w-8 h-8 text-muted-foreground/40" />,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <Card className={`p-8 text-center border-dashed flex flex-col items-center justify-center space-y-3 ${className || ''}`}>
      <div className="p-3 rounded-full bg-secondary/50 border border-border/60">
        {icon}
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};
