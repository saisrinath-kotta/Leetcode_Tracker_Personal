import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, ArrowRight, Layers, Zap } from 'lucide-react';
import { apiRequest } from '../../services/api';
import { Problem } from '../../types';
import { Badge } from '../ui/Badge';

interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandSearchModal: React.FC<CommandSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Categories list for static matching
  const TOPICS = ['Array', 'String', 'Linked List', 'Stack', 'Queue', 'Tree', 'Graph', 'Dynamic Programming', 'Greedy', 'Backtracking', 'Hash Table'];
  const PATTERNS = ['Two Pointers', 'Sliding Window', 'Hash Map', 'Binary Search', 'Fast/Slow Pointers', 'Monotonic Stack', 'DFS', 'BFS'];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        isOpen ? onClose() : undefined;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await apiRequest(`/problems?search=${encodeURIComponent(query)}&limit=8`);
        setResults(data.problems || []);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const matchedTopics = query.trim()
    ? TOPICS.filter((t) => t.toLowerCase().includes(query.toLowerCase()))
    : [];

  const matchedPatterns = query.trim()
    ? PATTERNS.filter((p) => p.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4" role="dialog" aria-modal="true" aria-label="Global search dialog">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" onClick={onClose} aria-hidden="true" />

      {/* Dialog Box */}
      <div className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-10">
        <div className="flex items-center px-4 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search problems, topics, patterns... (e.g. #287, Two Pointers)"
            className="w-full py-4 bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground font-medium"
            autoFocus
          />
          {query ? (
            <button onClick={() => setQuery('')} aria-label="Clear search" className="p-1 rounded text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground bg-muted border border-border rounded">
              ESC
            </kbd>
          )}
        </div>

        {/* Results / Categories Container */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {isLoading ? (
            <div className="p-8 text-center text-xs font-mono text-muted-foreground">Searching catalog...</div>
          ) : query.trim() ? (
            <>
              {/* Category: Problems */}
              {results.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-indigo-400" /> Problems
                  </div>
                  {results.map((problem) => (
                    <div
                      key={problem._id || problem.number}
                      onClick={() => {
                        navigate(`/problems/${problem.number}`);
                        onClose();
                      }}
                      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-secondary/70 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-muted-foreground font-bold">#{problem.number}</span>
                        <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                          {problem.title}
                        </span>
                        <Badge difficulty={problem.difficulty}>{problem.difficulty}</Badge>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  ))}
                </div>
              )}

              {/* Category: Topics */}
              {matchedTopics.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-border/60">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-sky-400" /> Topics
                  </div>
                  {matchedTopics.map((topic) => (
                    <div
                      key={topic}
                      onClick={() => {
                        navigate(`/problems?topic=${encodeURIComponent(topic)}`);
                        onClose();
                      }}
                      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-secondary/70 cursor-pointer transition-colors group text-xs font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="topic">{topic}</Badge>
                        <span className="text-muted-foreground text-[11px]">Browse topic problems</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  ))}
                </div>
              )}

              {/* Category: Patterns */}
              {matchedPatterns.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-border/60">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-purple-400" /> Patterns
                  </div>
                  {matchedPatterns.map((pattern) => (
                    <div
                      key={pattern}
                      onClick={() => {
                        navigate(`/problems?pattern=${encodeURIComponent(pattern)}`);
                        onClose();
                      }}
                      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-secondary/70 cursor-pointer transition-colors group text-xs font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="pattern">{pattern}</Badge>
                        <span className="text-muted-foreground text-[11px]">Browse pattern strategy</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  ))}
                </div>
              )}

              {results.length === 0 && matchedTopics.length === 0 && matchedPatterns.length === 0 && (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No matching problems, topics, or patterns found.
                </div>
              )}
            </>
          ) : (
            <div className="p-6 text-center text-xs text-muted-foreground space-y-2">
              <p>Type to search across <strong>Problems</strong>, <strong>Topics</strong>, and <strong>Patterns</strong>.</p>
              <div className="flex justify-center gap-2 text-[11px] font-mono text-muted-foreground pt-1">
                <span className="bg-secondary/50 px-2 py-1 rounded">#287</span>
                <span className="bg-secondary/50 px-2 py-1 rounded">Two Pointers</span>
                <span className="bg-secondary/50 px-2 py-1 rounded">Dynamic Programming</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
