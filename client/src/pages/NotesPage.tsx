import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import { apiRequest } from '../services/api';
import { Card } from '../components/ui/Card';

export const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadNotes() {
      try {
        const res = await apiRequest('/notes');
        setNotes(res.notes || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadNotes();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-border/60 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-400" /> Personal Notes Repository
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review all personal observations, confusion logs, and mistake notes recorded during practice sessions.
        </p>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-sm text-muted-foreground">Loading personal notes...</div>
      ) : notes.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          No personal notes saved yet. Add notes on any problem detail page to build your personal knowledge base!
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((note, idx) => (
            <Card
              key={idx}
              className="p-5 space-y-3 cursor-pointer hover:border-primary/50"
              onClick={() => navigate(`/problems/${note.problemNumber || 1}`)}
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="font-mono text-xs font-bold text-muted-foreground">#{note.problemNumber || 1}</span>
                <span className="text-xs text-primary font-semibold flex items-center gap-1">
                  Open Problem <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              {note.observation && (
                <div className="text-xs space-y-1">
                  <strong className="text-indigo-400 block font-semibold">Observation:</strong>
                  <p className="text-foreground/90">{note.observation}</p>
                </div>
              )}
              {note.confused && (
                <div className="text-xs space-y-1">
                  <strong className="text-amber-400 block font-semibold">Confused By:</strong>
                  <p className="text-foreground/90">{note.confused}</p>
                </div>
              )}
              {note.mistakes && (
                <div className="text-xs space-y-1">
                  <strong className="text-rose-400 block font-semibold">Mistakes:</strong>
                  <p className="text-foreground/90">{note.mistakes}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
