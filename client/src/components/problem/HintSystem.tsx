import React, { useState } from 'react';
import { Lightbulb, Lock, Unlock, Eye } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface HintSystemProps {
  hints: string[];
  onHintRevealed?: (count: number) => void;
}

export const HintSystem: React.FC<HintSystemProps> = ({ hints = [], onHintRevealed }) => {
  const [revealedLevel, setRevealedLevel] = useState<number>(0);

  const handleRevealNext = () => {
    if (revealedLevel < hints.length) {
      const nextLevel = revealedLevel + 1;
      setRevealedLevel(nextLevel);
      if (onHintRevealed) onHintRevealed(nextLevel);
    }
  };

  return (
    <Card className="p-6 space-y-5 border-amber-500/20 bg-amber-950/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Progressive Hint System</h3>
            <p className="text-xs text-muted-foreground">
              {revealedLevel} of {hints.length} hints unlocked
            </p>
          </div>
        </div>

        {revealedLevel < hints.length && (
          <Button variant="outline" size="sm" onClick={handleRevealNext} leftIcon={<Unlock className="w-3.5 h-3.5" />}>
            Reveal Hint #{revealedLevel + 1}
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {hints.map((hintText, index) => {
          const isRevealed = index < revealedLevel;
          return (
            <div
              key={index}
              className={`p-4 rounded-xl border transition-all ${
                isRevealed
                  ? 'bg-card border-amber-500/30 text-foreground shadow-sm'
                  : 'bg-secondary/20 border-border text-muted-foreground opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  {isRevealed ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  Hint #{index + 1}
                </span>
              </div>

              {isRevealed ? (
                <p className="text-sm leading-relaxed">{hintText}</p>
              ) : (
                <div className="flex items-center gap-2 text-xs italic">
                  <span>Click "Reveal Hint #{index + 1}" above when you get stuck.</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
