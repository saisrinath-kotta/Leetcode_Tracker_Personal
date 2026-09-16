import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ExternalLink,
  BookOpen,
  HelpCircle,
  Eye,
  Lightbulb,
  Youtube,
  Zap,
  Code2,
  Terminal,
  RotateCcw,
  FileText,
  Bot,
  CheckCircle2,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { apiRequest } from '../services/api';
import { Problem, UserProgress } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { InteractiveVisualizer } from '../components/problem/InteractiveVisualizer';
import { HintSystem } from '../components/problem/HintSystem';
import { YouTubeEmbed } from '../components/problem/YouTubeEmbed';
import { ApproachesTab } from '../components/problem/ApproachesTab';
import { ReferenceSolutions } from '../components/problem/ReferenceSolutions';
import { CodeEditor } from '../components/editor/CodeEditor';
import { AIMentorPanel } from '../components/problem/AIMentorPanel';

export const ProblemDetailPage: React.FC = () => {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [confidence, setConfidence] = useState<number>(0);
  const [notes, setNotes] = useState({ confused: '', observation: '', mistakes: '', remember: '' });
  const [userCode, setUserCode] = useState<string>('');
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProblemData() {
      setIsLoading(true);
      try {
        const res = await apiRequest(`/problems/number/${number}`);
        setProblem(res.problem);
        if (res.progress) {
          setProgress(res.progress);
          setConfidence(res.progress.confidence || 0);
          if (res.progress.notes) setNotes((prev) => ({ ...prev, observation: res.progress.notes }));
        }
      } catch (err) {
        console.error('Failed to fetch problem detail', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProblemData();
  }, [number]);

  const handleUpdateConfidence = async (val: number) => {
    setConfidence(val);
    if (!problem) return;
    try {
      await apiRequest(`/progress/${problem._id || problem.number}`, {
        method: 'PUT',
        body: JSON.stringify({ confidence: val }),
      });
    } catch {}
  };

  const handleSaveNotes = async () => {
    if (!problem) return;
    try {
      await apiRequest(`/notes/${problem._id || problem.number}`, {
        method: 'PUT',
        body: JSON.stringify(notes),
      });
    } catch {}
  };

  const handleRunCode = async (code: string, language: string) => {
    if (!problem) return;
    setUserCode(code);
    setIsExecuting(true);
    try {
      const res = await apiRequest('/submissions', {
        method: 'POST',
        body: JSON.stringify({
          problemId: problem._id || problem.number,
          language,
          code,
          isRunOnly: true,
        }),
      });
      setExecutionResult(res.runResult);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmitCode = async (code: string, language: string) => {
    if (!problem) return;
    setUserCode(code);
    setIsExecuting(true);
    try {
      const res = await apiRequest('/submissions', {
        method: 'POST',
        body: JSON.stringify({
          problemId: problem._id || problem.number,
          language,
          code,
        }),
      });
      setExecutionResult(res.execution);
      if (res.execution?.status === 'Accepted') {
        setConfidence((prev) => (prev === 0 ? 4 : prev));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecuting(false);
    }
  };

  if (isLoading || !problem) {
    return <div className="p-12 text-center text-sm text-muted-foreground animate-pulse">Loading problem learning suite...</div>;
  }

  const tabs = [
    { id: 'overview', name: '1. Overview', icon: BookOpen },
    { id: 'understand', name: '2. Understand', icon: HelpCircle },
    { id: 'visual', name: '3. Visualizer', icon: Eye },
    { id: 'hints', name: '4. Hints', icon: Lightbulb },
    { id: 'youtube', name: '5. Video', icon: Youtube },
    { id: 'approaches', name: '6. Approaches', icon: Zap },
    { id: 'solutions', name: '7. Reference Code', icon: Code2 },
    { id: 'editor', name: '8. Code Editor', icon: Terminal },
    { id: 'notes', name: '9. Notes & Review', icon: FileText },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Sticky Header */}
      <div className="bg-card/80 backdrop-blur-md border border-border p-5 rounded-2xl shadow-sm sticky top-16 z-20 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/problems')}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <span className="font-mono text-sm font-bold text-muted-foreground">#{problem.number}</span>
            <h1 className="text-xl font-bold text-foreground">{problem.title}</h1>
            <Badge difficulty={problem.difficulty}>{problem.difficulty}</Badge>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={problem.leetcodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary/40 text-xs font-semibold text-foreground hover:bg-secondary transition-all"
            >
              Open on LeetCode <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Topics & Patterns Chips */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {problem.topics?.map((t) => (
            <Badge key={t} variant="topic">{t}</Badge>
          ))}
          {problem.patterns?.map((p) => (
            <Badge key={p} variant="pattern">{p}</Badge>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-t border-border/60 pt-3 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <Card className="p-6 space-y-4">
                <h3 className="text-base font-bold text-foreground">Problem Description</h3>
                <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{problem.description}</p>
              </Card>

              {/* Examples */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-foreground">Examples</h3>
                {problem.examples?.map((ex, idx) => (
                  <Card key={idx} className="p-4 space-y-2 bg-secondary/20 border-border">
                    <span className="text-xs font-bold text-muted-foreground uppercase">Example {idx + 1}</span>
                    <div className="font-mono text-xs space-y-1">
                      <div><strong className="text-indigo-400">Input:</strong> {ex.input}</div>
                      <div><strong className="text-emerald-400">Output:</strong> {ex.output}</div>
                      {ex.explanation && <div className="text-muted-foreground text-[11px] mt-1"><strong className="text-foreground">Explanation:</strong> {ex.explanation}</div>}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Constraints */}
              <Card className="p-5 space-y-2">
                <h4 className="text-xs font-bold uppercase text-muted-foreground">Constraints</h4>
                <ul className="list-disc list-inside space-y-1 font-mono text-xs text-foreground/90">
                  {problem.constraints?.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </Card>
            </div>
          )}

          {/* TAB 2: UNDERSTAND */}
          {activeTab === 'understand' && (
            <Card className="p-6 space-y-6 animate-in fade-in duration-150">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-foreground">What is this problem actually asking?</h3>
                <p className="text-sm leading-relaxed text-foreground/90">{problem.simpleExplanation}</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <h4 className="text-xs font-bold uppercase text-amber-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Key Observation & Intuition
                </h4>
                <p className="text-sm text-foreground/90 font-medium">{problem.keyObservation}</p>
              </div>
            </Card>
          )}

          {/* TAB 3: VISUALIZER */}
          {activeTab === 'visual' && <InteractiveVisualizer visual={problem.visualExplanation} />}

          {/* TAB 4: HINTS */}
          {activeTab === 'hints' && <HintSystem hints={problem.hints} />}

          {/* TAB 5: YOUTUBE */}
          {activeTab === 'youtube' && <YouTubeEmbed video={problem.youtube} />}

          {/* TAB 6: APPROACHES */}
          {activeTab === 'approaches' && <ApproachesTab approaches={problem.approaches} />}

          {/* TAB 7: REFERENCE SOLUTIONS */}
          {activeTab === 'solutions' && <ReferenceSolutions solutions={problem.solutions} />}

          {/* TAB 8: CODE EDITOR */}
          {activeTab === 'editor' && (
            <div className="space-y-6">
              <CodeEditor
                onRun={handleRunCode}
                onSubmit={handleSubmitCode}
                isRunning={isExecuting}
                isSubmitting={isExecuting}
              />

              {/* Execution Feedback Banner */}
              {executionResult && (
                <Card className={`p-5 space-y-3 border ${executionResult.status === 'Accepted' ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-rose-500/40 bg-rose-950/10'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold flex items-center gap-2 ${executionResult.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {executionResult.status === 'Accepted' ? <CheckCircle2 className="w-5 h-5" /> : '❌ Execution Feedback'}
                      {executionResult.status}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      Runtime: {executionResult.runtimeMs}ms | Memory: {Math.round((executionResult.memoryKb || 32000) / 1024)}MB
                    </span>
                  </div>

                  {executionResult.errorMessage && (
                    <div className="p-3 rounded-lg bg-rose-950/30 font-mono text-xs text-rose-300">
                      {executionResult.errorMessage}
                    </div>
                  )}

                  {/* Test Results */}
                  {executionResult.testResults && (
                    <div className="space-y-2 pt-2 border-t border-border/40">
                      <span className="text-xs font-semibold text-muted-foreground uppercase">Sample Test Cases:</span>
                      {executionResult.testResults.map((t: any, i: number) => (
                        <div key={i} className="p-2.5 rounded bg-background border border-border text-xs font-mono flex items-center justify-between">
                          <span>Input: {t.input}</span>
                          <span className={t.passed ? 'text-emerald-400' : 'text-rose-400'}>{t.passed ? 'PASSED' : 'FAILED'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )}
            </div>
          )}

          {/* TAB 9: NOTES & REVIEW */}
          {activeTab === 'notes' && (
            <div className="space-y-6">
              {/* Confidence Rating */}
              <Card className="p-6 space-y-4">
                <h3 className="text-base font-bold text-foreground">Set Your Solution Confidence</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { val: 1, label: '😵 Don’t understand' },
                    { val: 2, label: '😐 Understand idea' },
                    { val: 3, label: '🙂 Solve with hints' },
                    { val: 4, label: '😎 Solve independently' },
                    { val: 5, label: '🔥 Can explain to someone' },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => handleUpdateConfidence(opt.val)}
                      className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                        confidence === opt.val
                          ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                          : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Personal Notes Form */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-foreground">Personal Problem Notes</h3>
                  <Button variant="primary" size="sm" onClick={handleSaveNotes}>Save Notes</Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">What confused me?</label>
                    <textarea
                      value={notes.confused}
                      onChange={(e) => setNotes({ ...notes, confused: e.target.value })}
                      placeholder="e.g. Setting boundary indices on binary search..."
                      className="w-full p-3 rounded-lg bg-secondary/30 border border-border text-xs text-foreground focus:outline-none"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Important Observation</label>
                    <textarea
                      value={notes.observation}
                      onChange={(e) => setNotes({ ...notes, observation: e.target.value })}
                      placeholder="e.g. Always check for empty string edge case first..."
                      className="w-full p-3 rounded-lg bg-secondary/30 border border-border text-xs text-foreground focus:outline-none"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Mistakes I Made</label>
                    <textarea
                      value={notes.mistakes}
                      onChange={(e) => setNotes({ ...notes, mistakes: e.target.value })}
                      placeholder="e.g. Forgot to advance slow pointer in loop..."
                      className="w-full p-3 rounded-lg bg-secondary/30 border border-border text-xs text-foreground focus:outline-none"
                      rows={2}
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Right Sidebar Column: AI Mentor Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-40">
            <AIMentorPanel problem={problem} userCode={userCode} />
          </div>
        </div>
      </div>
    </div>
  );
};
