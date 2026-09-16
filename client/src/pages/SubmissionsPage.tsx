import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, CheckCircle2, XCircle, Code2, ArrowRight } from 'lucide-react';
import { apiRequest } from '../services/api';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const SubmissionsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadSubmissions() {
      try {
        const res = await apiRequest('/submissions');
        setSubmissions(res.submissions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSubmissions();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-border/60 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <History className="w-6 h-6 text-indigo-400" /> Submission History
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Complete log of all code submissions, test execution results, and AI logic reviews.
        </p>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-sm text-muted-foreground">Loading submission history...</div>
      ) : submissions.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          No code submissions recorded yet. Open any problem page and submit code to track your history here!
        </Card>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub, idx) => (
            <Card
              key={idx}
              className="p-4 flex items-center justify-between gap-4 hover:border-primary/40 cursor-pointer"
              onClick={() => navigate(`/problems/${sub.problemNumber || 1}`)}
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs font-bold text-muted-foreground w-12 shrink-0">
                  #{sub.problemNumber || 1}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold flex items-center gap-1 ${
                        sub.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {sub.status === 'Accepted' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {sub.status}
                    </span>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {sub.language}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground block mt-1">
                    Submitted on {new Date(sub.createdAt || Date.now()).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                <span>Runtime: {sub.runtimeMs || 18}ms</span>
                <span>Memory: {Math.round((sub.memoryKb || 34000) / 1024)}MB</span>
                <ArrowRight className="w-4 h-4 text-primary" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
