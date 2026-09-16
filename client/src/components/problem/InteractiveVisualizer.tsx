import React, { useState } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { IVisualExplanation } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface VisualizerProps {
  visual?: IVisualExplanation;
}

export const InteractiveVisualizer: React.FC<VisualizerProps> = ({ visual }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!visual || !visual.steps || visual.steps.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        <Eye className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
        <p className="text-sm font-medium">Visual explanation for this pattern is generating.</p>
        <p className="text-xs text-muted-foreground mt-1">Review the step-by-step approach text below.</p>
      </Card>
    );
  }

  const currentStep = visual.steps[currentStepIndex];
  const state = currentStep?.state || {};

  return (
    <Card className="p-6 border-indigo-500/20 bg-indigo-950/10 space-y-6">
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            {visual.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Step {currentStepIndex + 1} of {visual.steps.length}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentStepIndex(Math.min(visual.steps.length - 1, currentStepIndex + 1))}
            disabled={currentStepIndex === visual.steps.length - 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStepIndex(0)}
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Step Description */}
      <div className="p-3.5 rounded-lg bg-card/80 border border-border text-sm leading-relaxed">
        <span className="font-semibold text-indigo-400 mr-2">Step {currentStep.step}:</span>
        {currentStep.description}
      </div>

      {/* Visual State Canvas */}
      <div className="p-6 rounded-xl bg-background border border-border/70 flex flex-col items-center justify-center gap-4 min-h-[160px]">
        {/* Array Visualization */}
        {state.nums && (
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {state.nums.map((num: number, idx: number) => {
              const isCurrent = state.currentIndex === idx;
              const isPointerL = state.L === idx;
              const isPointerR = state.R === idx;

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-12 h-12 rounded-lg border-2 font-mono font-bold text-base flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 scale-105 shadow-md shadow-indigo-500/20'
                        : isPointerL || isPointerR
                        ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                        : 'border-border bg-card text-foreground'
                    }`}
                  >
                    {num}
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">idx {idx}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Map State Display */}
        {state.map && (
          <div className="flex items-center gap-2 text-xs font-mono bg-secondary/40 px-3 py-1.5 rounded-lg border border-border">
            <span className="text-muted-foreground font-sans">Hash Map:</span>
            {JSON.stringify(state.map)}
          </div>
        )}

        {/* Result Match Banner */}
        {state.found && (
          <div className="px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-in zoom-in-95">
            🎉 Match Found! Returned indices: {JSON.stringify(state.result)}
          </div>
        )}
      </div>
    </Card>
  );
};
