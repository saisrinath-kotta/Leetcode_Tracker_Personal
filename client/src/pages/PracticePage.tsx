import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Play, Sparkles, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const PracticePage: React.FC = () => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [count, setCount] = useState<number>(3);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const TOPICS = ['Array', 'String', 'Linked List', 'Stack', 'Tree', 'Dynamic Programming', 'Two Pointers', 'Sliding Window'];

  const toggleTopic = (t: string) => {
    setSelectedTopics((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const data = await apiRequest('/practice/generate', {
        method: 'POST',
        body: JSON.stringify({
          topics: selectedTopics,
          difficulty: selectedDifficulty,
          count,
        }),
      });

      if (data.problems && data.problems.length > 0) {
        navigate(`/problems/${data.problems[0].number}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-border/60 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Target className="w-6 h-6 text-indigo-400" /> Custom Practice Session
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Configure a focused problem set targeted at your specific weak topics or patterns.
        </p>
      </div>

      <Card className="p-6 space-y-6">
        {/* Topic Multi-select */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-muted-foreground">Select Target Topics:</label>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((topic) => {
              const isSelected = selectedTopics.includes(topic);
              return (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-muted-foreground">Difficulty Level:</label>
          <div className="flex gap-2">
            {['', 'Easy', 'Medium', 'Hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-4 py-2 rounded-lg border text-xs font-semibold transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {diff || 'Any Difficulty'}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-muted-foreground">Number of Problems:</label>
          <div className="flex gap-2">
            {[2, 3, 5, 10].map((num) => (
              <button
                key={num}
                onClick={() => setCount(num)}
                className={`px-4 py-2 rounded-lg border text-xs font-mono font-bold transition-all ${
                  count === num
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-secondary/40 border-border text-muted-foreground'
                }`}
              >
                {num} Problems
              </button>
            ))}
          </div>
        </div>

        <Button
          variant="accent"
          size="lg"
          className="w-full"
          onClick={handleGenerate}
          isLoading={isLoading}
          leftIcon={<Sparkles className="w-4 h-4" />}
        >
          Generate Practice Set & Start
        </Button>
      </Card>
    </div>
  );
};
