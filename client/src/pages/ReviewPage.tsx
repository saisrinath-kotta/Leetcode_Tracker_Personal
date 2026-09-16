import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, AlertCircle, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { apiRequest } from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const ReviewPage: React.FC = () => {
  const [reviewItems, setReviewItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadReview() {
      try {
        const res = await apiRequest('/review');
        setReviewItems(res.reviewItems || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadReview();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-border/60 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <RotateCcw className="w-6 h-6 text-amber-400" /> Spaced Repetition Review
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review queue generated based on low confidence ratings, previous wrong answers, and old solved dates.
        </p>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-sm text-muted-foreground">Generating personalized review queue...</div>
      ) : reviewItems.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          🎉 All clear! No problems currently require immediate review. Keep solving new problems!
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviewItems.map((item: any, idx: number) => {
            const p = item.problem || item;
            return (
              <Card
                key={idx}
                className="p-5 flex flex-col justify-between space-y-4 border-amber-500/20 bg-amber-950/5 hover:border-amber-500/40"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-muted-foreground">#{p.number}</span>
                    <Badge difficulty={p.difficulty}>{p.difficulty}</Badge>
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{p.title}</h3>
                  <p className="text-xs text-muted-foreground">{p.simpleExplanation}</p>
                </div>

                <div className="pt-3 border-t border-border/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {item.reason}
                    </span>
                    <span className="font-mono text-muted-foreground">Confidence: {item.confidence || 3}/5</span>
                  </div>

                  <Button
                    variant="accent"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/problems/${p.number}`)}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Practice Again
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
