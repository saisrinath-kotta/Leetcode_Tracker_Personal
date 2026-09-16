import React, { useState } from 'react';
import { Copy, Check, Code2, Eye, EyeOff } from 'lucide-react';
import { ISolution } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface ReferenceSolutionsProps {
  solutions: ISolution[];
}

export const ReferenceSolutions: React.FC<ReferenceSolutionsProps> = ({ solutions = [] }) => {
  const [selectedLang, setSelectedLang] = useState<string>('javascript');
  const [copied, setCopied] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const availableLangs = ['javascript', 'python', 'cpp', 'java', 'typescript'];

  const currentSolution = solutions.find((s) => s.language === selectedLang) || solutions[0];

  const handleCopy = () => {
    if (currentSolution?.code) {
      navigator.clipboard.writeText(currentSolution.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-semibold text-foreground">Reference Solutions</h3>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1 bg-secondary/40 p-1 rounded-lg border border-border">
          {availableLangs.map((lang) => {
            const hasSol = solutions.some((s) => s.language === lang);
            return (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                  selectedLang === lang
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : hasSol
                    ? 'text-muted-foreground hover:text-foreground'
                    : 'text-muted-foreground/40 cursor-not-allowed'
                }`}
              >
                {lang === 'cpp' ? 'C++' : lang.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reveal Toggle Banner */}
      {!isRevealed ? (
        <div className="p-8 text-center rounded-xl bg-secondary/20 border border-border space-y-3">
          <EyeOff className="w-8 h-8 text-muted-foreground mx-auto" />
          <div>
            <h4 className="text-sm font-semibold text-foreground">Solution Hidden by Default</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Try solving the problem yourself or reviewing hints before revealing the full code!
            </p>
          </div>
          <Button variant="accent" size="sm" onClick={() => setIsRevealed(true)} leftIcon={<Eye className="w-4 h-4" />}>
            Reveal {selectedLang.toUpperCase()} Solution
          </Button>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground">
              Time: <strong className="text-emerald-400">{currentSolution?.complexity?.time || 'O(N)'}</strong> | Space:{' '}
              <strong className="text-sky-400">{currentSolution?.complexity?.space || 'O(1)'}</strong>
            </span>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy} leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}>
                {copied ? 'Copied!' : 'Copy Code'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsRevealed(false)} leftIcon={<EyeOff className="w-3.5 h-3.5" />}>
                Hide Solution
              </Button>
            </div>
          </div>

          {/* Code Block */}
          <div className="rounded-xl overflow-hidden border border-border bg-slate-950 p-4 font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto">
            <pre>{currentSolution?.code || '// Solution coming soon...'}</pre>
          </div>

          {/* Explanation */}
          {currentSolution?.explanation && (
            <div className="p-4 rounded-xl bg-secondary/30 border border-border text-xs text-foreground/90 leading-relaxed">
              <strong className="text-foreground block mb-1">Line-by-Line Breakdown:</strong>
              {currentSolution.explanation}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
