import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, AlertCircle, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { ReviewItem } from '../../types';

interface ReviewQueueSectionProps {
  items: ReviewItem[];
}

export const ReviewQueueSection: React.FC<ReviewQueueSectionProps> = ({ items }) => {
  const navigate = useNavigate();

  if (!items || items.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-amber-400" /> Problems To Review
        </h2>
        <EmptyState
          icon={<RotateCcw className="w-6 h-6 text-muted-foreground" />}
          title="Review queue empty"
          description="You have no problems flagged for review right now. Excellent progress!"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-amber-400" /> Problems To Review
        </h2>
        <button
          onClick={() => navigate('/review')}
          className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
        >
          View All <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <Card
            key={idx}
            className="p-4 space-y-2 border-amber-500/20 bg-amber-950/5 hover:border-amber-500/40 transition-all cursor-pointer"
            onClick={() => navigate(`/problems/${item.number}`)}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-muted-foreground">#{item.number}</span>
              <Badge variant="medium" className="text-[10px]">
                Confidence: {item.userConfidence}/5
              </Badge>
            </div>

            <h4 className="text-sm font-semibold text-foreground truncate">{item.title}</h4>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
              <span className="text-amber-400 font-medium flex items-center gap-1 text-[11px]">
                <AlertCircle className="w-3 h-3" /> {item.reason}
              </span>
              <span className="text-primary flex items-center gap-1 font-semibold text-[11px]">
                Review <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
