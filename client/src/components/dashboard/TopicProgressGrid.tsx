import React from 'react';
import { Layers } from 'lucide-react';
import { Card } from '../ui/Card';
import { TopicProgressItem } from '../../types';

interface TopicProgressGridProps {
  topics: TopicProgressItem[];
}

export const TopicProgressGrid: React.FC<TopicProgressGridProps> = ({ topics }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" /> Topic Progress
        </h2>
        <span className="text-xs text-muted-foreground font-mono">10 Core Topics</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {topics.map((topic) => (
          <Card key={topic.name} className="p-4 space-y-2.5 hover:border-primary/40">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">{topic.name}</span>
              <span className="text-xs font-mono font-medium text-indigo-400 font-bold">
                {topic.percentage}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(4, topic.percentage)}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] text-muted-foreground font-mono pt-0.5">
              <span>{topic.solved} / {topic.total} solved</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
