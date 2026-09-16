import React from 'react';
import { ArrowRight, CheckCircle2, Zap, Clock, HardDrive, HelpCircle } from 'lucide-react';
import { IApproach } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface ApproachesTabProps {
  approaches: IApproach[];
}

export const ApproachesTab: React.FC<ApproachesTabProps> = ({ approaches = [] }) => {
  return (
    <div className="space-y-6">
      {/* Progression Banner */}
      <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/10 flex items-center justify-between flex-wrap gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Algorithmic Evolution:</span>
        <div className="flex items-center gap-2 text-xs font-medium">
          {approaches.map((app, idx) => (
            <React.Fragment key={idx}>
              <span className={`px-2.5 py-1 rounded-md border ${idx === approaches.length - 1 ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 font-bold' : 'bg-secondary/40 border-border text-muted-foreground'}`}>
                {app.name}
              </span>
              {idx < approaches.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Approach Cards */}
      <div className="space-y-6">
        {approaches.map((app, index) => {
          const isOptimal = index === approaches.length - 1;
          return (
            <Card
              key={index}
              className={`p-6 space-y-4 ${
                isOptimal ? 'border-indigo-500/40 bg-card shadow-lg shadow-indigo-500/5' : 'border-border bg-card/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center ${isOptimal ? 'bg-indigo-600 text-white' : 'bg-secondary text-foreground'}`}>
                    #{index + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                      {app.name}
                      {isOptimal && (
                        <Badge variant="topic" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/40">
                          Recommended Optimal
                        </Badge>
                      )}
                    </h3>
                  </div>
                </div>

                {/* Complexities */}
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                    <Clock className="w-3.5 h-3.5" /> Time: {app.timeComplexity}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-md border border-sky-500/20">
                    <HardDrive className="w-3.5 h-3.5" /> Space: {app.spaceComplexity}
                  </span>
                </div>
              </div>

              {/* Intuition & Idea */}
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/60 text-sm leading-relaxed space-y-2">
                <div className="font-semibold text-foreground flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Core Idea & Intuition
                </div>
                <p className="text-foreground/90">{app.idea}</p>
              </div>

              {/* Step-by-Step Algorithm */}
              {app.steps && app.steps.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Algorithm Steps</span>
                  <ol className="list-decimal list-inside space-y-1.5 text-sm text-foreground/90 pl-1">
                    {app.steps.map((step, sIdx) => (
                      <li key={sIdx} className="leading-relaxed">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Why it works / Complexity rationale */}
              <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
                <span className="font-semibold text-foreground">Why this complexity occurs: </span>
                {app.explanation}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
