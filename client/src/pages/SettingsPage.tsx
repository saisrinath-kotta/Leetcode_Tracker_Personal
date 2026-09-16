import React, { useState } from 'react';
import { Settings, Save, Check } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const SettingsPage: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [defaultLang, setDefaultLang] = useState('javascript');
  const [dailyGoal, setDailyGoal] = useState(2);
  const [fontSize, setFontSize] = useState(14);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-border/60 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-400" /> Platform Settings
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Customize your learning environment, Monaco code editor preferences, and daily goal targets.
        </p>
      </div>

      <Card className="p-6 space-y-6">
        {/* Theme Preference */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-muted-foreground">Appearance Theme:</label>
          <div className="flex gap-3">
            {[
              { val: 'dark', label: 'Obsidian Dark (Recommended)' },
              { val: 'light', label: 'Clean Light' },
            ].map((t) => (
              <button
                key={t.val}
                onClick={() => setTheme(t.val as any)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  theme === t.val
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-secondary/40 border-border text-muted-foreground'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Default Programming Language */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-muted-foreground">Default Code Editor Language:</label>
          <select
            value={defaultLang}
            onChange={(e) => setDefaultLang(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-secondary/30 border border-border text-xs text-foreground font-mono focus:outline-none"
          >
            <option value="javascript">JavaScript (Node.js)</option>
            <option value="typescript">TypeScript 5.4</option>
            <option value="python">Python 3.11</option>
            <option value="java">Java 21</option>
            <option value="cpp">C++ 17</option>
          </select>
        </div>

        {/* Daily Target Goal */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-muted-foreground">Daily Problem Target Goal:</label>
          <div className="flex gap-2">
            {[1, 2, 3, 5].map((g) => (
              <button
                key={g}
                onClick={() => setDailyGoal(g)}
                className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all ${
                  dailyGoal === g
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-secondary/40 border-border text-muted-foreground'
                }`}
              >
                {g} Problem{g > 1 ? 's' : ''} / Day
              </button>
            ))}
          </div>
        </div>

        {/* Editor Font Size */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-muted-foreground">Monaco Editor Font Size ({fontSize}px):</label>
          <input
            type="range"
            min={12}
            max={20}
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
            className="w-full accent-primary"
          />
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          leftIcon={saved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
        >
          {saved ? 'Preferences Saved!' : 'Save Settings'}
        </Button>
      </Card>
    </div>
  );
};
