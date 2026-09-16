import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, ExternalLink, CheckCircle2, Circle, Clock, LayoutGrid, List } from 'lucide-react';
import { apiRequest } from '../services/api';
import { Problem, Difficulty, ProblemStatus } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const ProblemsPage: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedPattern, setSelectedPattern] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const TOPICS = [
    'Array',
    'String',
    'Linked List',
    'Stack',
    'Queue',
    'Tree',
    'Graph',
    'Dynamic Programming',
    'Greedy',
    'Backtracking',
    'Hash Table',
    'Two Pointers',
    'Sliding Window',
    'Binary Search',
  ];

  const PATTERNS = [
    'Two Pointers',
    'Sliding Window',
    'Hash Map',
    'Binary Search',
    'Fast/Slow Pointers',
    'Monotonic Stack',
    'DFS',
    'BFS',
    'Dynamic Programming',
  ];

  useEffect(() => {
    fetchProblems();
  }, [pagination.page, search, selectedDifficulty, selectedStatus, selectedTopic, selectedPattern]);

  async function fetchProblems() {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search,
        difficulty: selectedDifficulty,
        status: selectedStatus,
        topic: selectedTopic,
        pattern: selectedPattern,
      });

      const res = await apiRequest(`/problems?${queryParams.toString()}`);
      setProblems(res.problems || []);
      setPagination(res.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 });
    } catch (err) {
      console.error('Failed to load problems', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Problem Library</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Browse 500 LeetCode problems with original educational explanations & multi-language solutions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            leftIcon={<List className="w-4 h-4" />}
          >
            List
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            leftIcon={<LayoutGrid className="w-4 h-4" />}
          >
            Grid
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 space-y-4 bg-card/80">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              placeholder="Search by problem #, title, topic, or pattern..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-secondary/30 border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Difficulty Dropdown */}
          <select
            value={selectedDifficulty}
            onChange={(e) => {
              setSelectedDifficulty(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className="px-3 py-2 rounded-lg bg-secondary/30 border border-border text-xs text-foreground focus:outline-none"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className="px-3 py-2 rounded-lg bg-secondary/30 border border-border text-xs text-foreground focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Solved">Solved</option>
            <option value="Attempted">Attempted</option>
            <option value="Not Started">Not Started</option>
          </select>
        </div>

        {/* Topic & Pattern Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase shrink-0">Topics:</span>
          <button
            onClick={() => setSelectedTopic('')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              !selectedTopic ? 'bg-primary text-primary-foreground' : 'bg-secondary/40 text-muted-foreground hover:text-foreground'
            }`}
          >
            All Topics
          </button>
          {TOPICS.slice(0, 8).map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(selectedTopic === topic ? '' : topic)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 transition-all ${
                selectedTopic === topic
                  ? 'bg-sky-500 text-white font-semibold'
                  : 'bg-secondary/40 text-muted-foreground hover:text-foreground'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </Card>

      {/* Problem Results */}
      {isLoading ? (
        <div className="p-12 text-center text-sm text-muted-foreground">Loading problem library...</div>
      ) : problems.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          No problems found matching your filters. Try clearing your search query.
        </Card>
      ) : viewMode === 'list' ? (
        /* List View */
        <div className="border border-border/80 rounded-xl overflow-hidden bg-card divide-y divide-border/60 shadow-sm">
          {problems.map((problem) => (
            <div
              key={problem._id || problem.number}
              onClick={() => navigate(`/problems/${problem.number}`)}
              className="p-4 flex items-center justify-between gap-4 hover:bg-secondary/40 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="font-mono text-xs font-bold text-muted-foreground w-12 shrink-0">
                  #{problem.number}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {problem.title}
                    </h3>
                    <Badge difficulty={problem.difficulty}>{problem.difficulty}</Badge>
                    {problem.userStatus === 'Solved' && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Solved
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {problem.topics?.map((topic) => (
                      <span key={topic} className="text-[11px] font-mono text-muted-foreground">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {problem.patterns?.[0] && (
                  <Badge variant="pattern" className="hidden sm:inline-flex">
                    {problem.patterns[0]}
                  </Badge>
                )}
                <a
                  href={problem.leetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
                  title="Open on LeetCode"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {problems.map((problem) => (
            <Card
              key={problem._id || problem.number}
              onClick={() => navigate(`/problems/${problem.number}`)}
              className="p-5 flex flex-col justify-between space-y-4 hover:border-primary/50"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground font-bold">#{problem.number}</span>
                  <Badge difficulty={problem.difficulty}>{problem.difficulty}</Badge>
                </div>
                <h3 className="text-base font-semibold text-foreground line-clamp-1">{problem.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{problem.simpleExplanation}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/60">
                <div className="flex items-center gap-1.5">
                  {problem.topics?.slice(0, 2).map((t) => (
                    <Badge key={t} variant="topic" className="text-[10px]">
                      {t}
                    </Badge>
                  ))}
                </div>
                <span className="text-xs font-semibold text-primary">Solve →</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border/60">
        <span className="text-xs text-muted-foreground">
          Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total problems)
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination((prev) => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
            disabled={pagination.page >= pagination.totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
