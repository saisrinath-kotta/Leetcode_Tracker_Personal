import React from 'react';
import { Card } from '../ui/Card';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2 border-b border-border/60 pb-6">
        <div className="h-7 w-64 bg-secondary/60 rounded-md" />
        <div className="h-4 w-96 bg-secondary/40 rounded-md" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Card key={i} className="p-4 space-y-3">
            <div className="h-3 w-16 bg-secondary/60 rounded" />
            <div className="h-6 w-12 bg-secondary/80 rounded" />
            <div className="h-2 w-20 bg-secondary/40 rounded" />
          </Card>
        ))}
      </div>

      {/* Featured Banner & Daily Goal Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 space-y-4">
          <div className="h-4 w-32 bg-secondary/60 rounded" />
          <div className="h-6 w-72 bg-secondary/80 rounded" />
          <div className="flex gap-2">
            <div className="h-5 w-16 bg-secondary/40 rounded-full" />
            <div className="h-5 w-20 bg-secondary/40 rounded-full" />
          </div>
          <div className="h-3 w-full bg-secondary/30 rounded" />
          <div className="h-10 w-36 bg-secondary/60 rounded-lg" />
        </Card>

        <Card className="p-6 space-y-4">
          <div className="h-4 w-28 bg-secondary/60 rounded" />
          <div className="h-8 w-24 bg-secondary/80 rounded" />
          <div className="h-3 w-full bg-secondary/40 rounded-full" />
          <div className="h-9 w-full bg-secondary/50 rounded-lg" />
        </Card>
      </div>

      {/* Topics & Sidebar Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-5 w-40 bg-secondary/60 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-4 space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-secondary/60 rounded" />
                  <div className="h-4 w-12 bg-secondary/40 rounded" />
                </div>
                <div className="h-2 w-full bg-secondary/40 rounded-full" />
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-5 w-44 bg-secondary/60 rounded" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4 space-y-2">
              <div className="h-4 w-20 bg-secondary/60 rounded" />
              <div className="h-5 w-48 bg-secondary/80 rounded" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
