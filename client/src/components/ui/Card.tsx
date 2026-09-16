import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick, hoverEffect = true }) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-xl border border-border/80 bg-card p-5 text-card-foreground shadow-sm transition-all duration-200',
        hoverEffect && 'hover:border-primary/40 hover:shadow-md',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};
