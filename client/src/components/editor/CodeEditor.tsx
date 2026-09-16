import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Send, RotateCcw, Check, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface CodeEditorProps {
  initialCode?: string;
  defaultLanguage?: string;
  onRun?: (code: string, language: string) => void;
  onSubmit?: (code: string, language: string) => void;
  isRunning?: boolean;
  isSubmitting?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode,
  defaultLanguage = 'javascript',
  onRun,
  onSubmit,
  isRunning = false,
  isSubmitting = false,
}) => {
  const [language, setLanguage] = useState<string>(defaultLanguage);
  const [code, setCode] = useState<string>(initialCode || getDefaultTemplate(defaultLanguage));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    } else {
      setCode(getDefaultTemplate(language));
    }
  }, [language, initialCode]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }
  };

  const handleReset = () => {
    setCode(getDefaultTemplate(language));
  };

  return (
    <Card className="p-0 overflow-hidden border-border bg-card flex flex-col h-[560px]">
      {/* Editor Header Toolbar */}
      <div className="h-12 border-b border-border bg-secondary/30 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-2.5 py-1 rounded-md bg-card border border-border text-xs font-mono font-medium focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python 3</option>
            <option value="java">Java</option>
            <option value="cpp">C++ 17</option>
          </select>

          {saved && <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1"><Check className="w-3 h-3"/> Auto-saved</span>}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleReset} title="Reset Template">
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onRun && onRun(code, language)}
            isLoading={isRunning}
            leftIcon={<Play className="w-3.5 h-3.5 text-emerald-400" />}
          >
            Run Tests
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onSubmit && onSubmit(code, language)}
            isLoading={isSubmitting}
            leftIcon={<Send className="w-3.5 h-3.5" />}
          >
            Submit
          </Button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 w-full bg-slate-950 relative">
        <Editor
          height="100%"
          language={language === 'cpp' ? 'cpp' : language}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
    </Card>
  );
};

function getDefaultTemplate(lang: string): string {
  switch (lang) {
    case 'javascript':
      return `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction solution(nums, target) {\n  // Write your code here\n  \n}`;
    case 'typescript':
      return `function solution(nums: number[], target: number): number[] {\n  // Write your code here\n  return [];\n}`;
    case 'python':
      return `class Solution:\n    def solution(self, nums: List[int], target: int) -> List[int]:\n        # Write your code here\n        pass`;
    case 'java':
      return `class Solution {\n    public int[] solution(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}`;
    case 'cpp':
      return `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> solution(vector<int>& nums, int target) {\n        // Write your code here\n        return {};\n    }\n};`;
    default:
      return `// Write your code here`;
  }
}
