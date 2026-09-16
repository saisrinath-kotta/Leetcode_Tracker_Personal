import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, Edit3, Trash2, X, Check, Loader2 } from 'lucide-react';
import { apiRequest } from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<any | null>(null);
  const [editObservation, setEditObservation] = useState('');
  const [editConfused, setEditConfused] = useState('');
  const [editMistakes, setEditMistakes] = useState('');
  const [editRemember, setEditRemember] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  async function loadNotes() {
    try {
      setIsLoading(true);
      const res = await apiRequest('/notes');
      setNotes(res.notes || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  const handleOpenEdit = (note: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingNote(note);
    setEditObservation(note.observation || '');
    setEditConfused(note.confused || '');
    setEditMistakes(note.mistakes || '');
    setEditRemember(note.remember || '');
    setError(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote) return;
    setIsSaving(true);
    setError(null);
    try {
      const targetId = editingNote.problemId?._id || editingNote.problemId || editingNote.problemNumber;
      const res = await apiRequest(`/notes/${targetId}`, {
        method: 'PUT',
        body: JSON.stringify({
          observation: editObservation,
          confused: editConfused,
          mistakes: editMistakes,
          remember: editRemember,
        }),
      });

      const updated = res.note;
      setNotes((prev) =>
        prev.map((n) =>
          n._id === editingNote._id || (n.problemNumber && n.problemNumber === editingNote.problemNumber)
            ? { ...n, ...updated, observation: editObservation, confused: editConfused, mistakes: editMistakes, remember: editRemember }
            : n
        )
      );
      setEditingNote(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update note');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (note: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm(`Are you sure you want to delete note for Problem #${note.problemNumber || ''}?`);
    if (!confirmed) return;

    const noteId = note._id || note.problemId?._id || note.problemNumber;
    setDeletingId(noteId);
    setError(null);
    try {
      await apiRequest(`/notes/${noteId}`, {
        method: 'DELETE',
      });
      setNotes((prev) => prev.filter((n) => n._id !== note._id && n.problemNumber !== note.problemNumber));
    } catch (err: any) {
      setError(err.message || 'Failed to delete note');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-border/60 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-400" /> Personal Notes Repository
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review, edit, and manage all personal observations, confusion logs, and mistake notes recorded during practice.
        </p>
      </div>

      {error && <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/40 text-xs text-rose-300">{error}</div>}

      {isLoading ? (
        <div className="p-12 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
          <span>Loading personal notes...</span>
        </div>
      ) : notes.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          No personal notes saved yet. Add notes on any problem detail page to build your personal knowledge base!
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((note, idx) => (
            <Card key={note._id || idx} className="p-5 space-y-3 relative group">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <div
                  className="flex items-center gap-2 cursor-pointer hover:text-indigo-400 transition-colors"
                  onClick={() => navigate(`/problems/${note.problemNumber || 1}`)}
                >
                  <span className="font-mono text-xs font-bold text-muted-foreground">#{note.problemNumber || 1}</span>
                  <span className="text-xs font-bold text-foreground">
                    {note.problemId?.title ? note.problemId.title : `Problem #${note.problemNumber}`}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/30"
                    onClick={(e) => handleOpenEdit(note, e)}
                    title="Edit Note"
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
                    onClick={(e) => handleDelete(note, e)}
                    isLoading={deletingId === (note._id || note.problemNumber)}
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                  </Button>
                </div>
              </div>

              {note.observation && (
                <div className="text-xs space-y-1">
                  <strong className="text-indigo-400 block font-semibold">Observation:</strong>
                  <p className="text-foreground/90 whitespace-pre-wrap">{note.observation}</p>
                </div>
              )}
              {note.confused && (
                <div className="text-xs space-y-1">
                  <strong className="text-amber-400 block font-semibold">Confused By:</strong>
                  <p className="text-foreground/90 whitespace-pre-wrap">{note.confused}</p>
                </div>
              )}
              {note.mistakes && (
                <div className="text-xs space-y-1">
                  <strong className="text-rose-400 block font-semibold">Mistakes:</strong>
                  <p className="text-foreground/90 whitespace-pre-wrap">{note.mistakes}</p>
                </div>
              )}
              {note.remember && (
                <div className="text-xs space-y-1">
                  <strong className="text-emerald-400 block font-semibold">Key Takeaways:</strong>
                  <p className="text-foreground/90 whitespace-pre-wrap">{note.remember}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Edit Note Modal */}
      {editingNote && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <Card className="w-full max-w-lg p-6 space-y-4 border-indigo-500/30 shadow-2xl bg-card max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-400" /> Edit Note for Problem #{editingNote.problemNumber}
              </h3>
              <button
                onClick={() => setEditingNote(null)}
                aria-label="Close Edit Note Modal"
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-indigo-400">Observation</label>
                <textarea
                  value={editObservation}
                  onChange={(e) => setEditObservation(e.target.value)}
                  placeholder="Key observations about the approach..."
                  rows={2}
                  className="w-full p-2.5 rounded-lg bg-secondary/30 border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-amber-400">Confused By</label>
                <textarea
                  value={editConfused}
                  onChange={(e) => setEditConfused(e.target.value)}
                  placeholder="What logic or edge cases were confusing?"
                  rows={2}
                  className="w-full p-2.5 rounded-lg bg-secondary/30 border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-rose-400">Mistakes</label>
                <textarea
                  value={editMistakes}
                  onChange={(e) => setEditMistakes(e.target.value)}
                  placeholder="Mistakes made during implementation..."
                  rows={2}
                  className="w-full p-2.5 rounded-lg bg-secondary/30 border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-emerald-400">Key Takeaways</label>
                <textarea
                  value={editRemember}
                  onChange={(e) => setEditRemember(e.target.value)}
                  placeholder="Things to remember for future reviews..."
                  rows={2}
                  className="w-full p-2.5 rounded-lg bg-secondary/30 border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                <Button variant="ghost" size="sm" type="button" onClick={() => setEditingNote(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" isLoading={isSaving} leftIcon={<Check className="w-3.5 h-3.5" />}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
