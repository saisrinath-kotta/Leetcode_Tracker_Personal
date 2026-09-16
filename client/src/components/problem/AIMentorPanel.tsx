import React, { useState } from 'react';
import { Bot, Sparkles, Send, Lightbulb, HelpCircle, Code, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { apiRequest } from '../../services/api';
import { Problem } from '../../types';

interface AIMentorPanelProps {
  problem: Problem;
  userCode?: string;
}

export const AIMentorPanel: React.FC<AIMentorPanelProps> = ({ problem, userCode }) => {
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; content: string; reviewResult?: any }[]>([
    {
      role: 'ai',
      content: `👋 Hi! I am your AI DSA Mentor. I can guide you through **#${problem.number} ${problem.title}** without spoiling the solution. What would you like to explore?`,
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: string, customQuery?: string) => {
    setIsLoading(true);
    const userMsg = customQuery || `Requesting ${action}...`;
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);

    try {
      const data = await apiRequest('/ai/ask', {
        method: 'POST',
        body: JSON.stringify({
          problemId: problem._id || problem.number,
          action,
          code: userCode,
          query: customQuery,
        }),
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: data.message,
          reviewResult: data.reviewResult,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: '⚠️ Unable to connect to AI Mentor service. Default pedagogical rules are active.',
        },
      ]);
    } finally {
      setIsLoading(false);
      setInputQuery('');
    }
  };

  return (
    <Card className="p-5 border-indigo-500/30 bg-gradient-to-b from-indigo-950/20 to-card flex flex-col h-[560px] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              AI DSA Mentor
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                GPT-4o
              </span>
            </h3>
            <p className="text-[10px] text-muted-foreground">Pedagogical hint-first algorithm coach</p>
          </div>
        </div>
      </div>

      {/* Quick Action Chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => handleAction('explain')}
          className="text-[11px] px-2.5 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 transition-all"
        >
          💡 Explain Problem
        </button>
        <button
          onClick={() => handleAction('hint')}
          className="text-[11px] px-2.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-all"
        >
          🔍 Progressive Hint
        </button>
        <button
          onClick={() => handleAction('pattern')}
          className="text-[11px] px-2.5 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-all"
        >
          🧠 Explain Pattern
        </button>
        <button
          onClick={() => handleAction('review')}
          className="text-[11px] px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-all"
        >
          📝 Review My Code
        </button>
      </div>

      {/* Message Chat Feed */}
      <div className="flex-1 overflow-y-auto space-y-3 p-2 rounded-xl bg-background/50 border border-border/50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`p-3 rounded-xl text-xs leading-relaxed max-w-[90%] whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground font-medium rounded-br-none'
                  : 'bg-card border border-border text-foreground rounded-bl-none shadow-sm'
              }`}
            >
              {msg.content}

              {/* Review Feedback Box */}
              {msg.reviewResult && (
                <div className="mt-3 p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-1.5 text-[11px]">
                  <div className="font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> {msg.reviewResult.correctness}
                  </div>
                  <div>
                    <strong>Time Complexity:</strong> {msg.reviewResult.timeComplexity} | <strong>Space:</strong> {msg.reviewResult.spaceComplexity}
                  </div>
                  <div>
                    <strong>Algorithm Pattern:</strong> {msg.reviewResult.algorithm}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-xs text-muted-foreground italic flex items-center gap-2 p-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" /> AI Mentor is thinking...
          </div>
        )}
      </div>

      {/* Input query field */}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && inputQuery.trim() && handleAction('ask', inputQuery)}
          placeholder="Ask AI Mentor a question..."
          className="flex-1 px-3 py-2 rounded-lg bg-card border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <Button
          variant="primary"
          size="sm"
          onClick={() => inputQuery.trim() && handleAction('ask', inputQuery)}
          isLoading={isLoading}
          leftIcon={<Send className="w-3.5 h-3.5" />}
        >
          Ask
        </Button>
      </div>
    </Card>
  );
};
