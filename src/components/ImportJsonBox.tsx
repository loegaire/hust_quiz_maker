import { useState } from 'react';
import { parseQuizJson, saveImportedQuiz } from '../lib/importQuiz';
import type { QuizPackFile } from '../types/quiz';

interface ImportJsonBoxProps {
  onImported: () => void;
}

export function ImportJsonBox({ onImported }: ImportJsonBoxProps) {
  const [raw, setRaw] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<QuizPackFile | null>(null);

  const validate = () => {
    try {
      const parsed = parseQuizJson(raw);
      setPreview(parsed);
      setError(null);
    } catch (e) {
      setPreview(null);
      setError(e instanceof Error ? e.message : 'Failed to validate JSON');
    }
  };

  const save = async () => {
    if (!preview) return;
    await saveImportedQuiz(preview);
    setRaw('');
    setPreview(null);
    onImported();
  };

  const readFile = async (file: File) => {
    const text = await file.text();
    setRaw(text);
  };

  return (
    <div className="neo-card space-y-3">
      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        rows={12}
        className="neo-input min-h-72 w-full font-mono text-sm"
        placeholder="Paste quiz JSON here"
      />
      <input
        type="file"
        accept="application/json,.json"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void readFile(file);
        }}
      />
      <div className="flex gap-2">
        <button type="button" onClick={validate} className="neo-button">
          Validate
        </button>
        <button type="button" onClick={() => void save()} disabled={!preview} className="neo-button-secondary disabled:opacity-40">
          Save
        </button>
      </div>
      {error ? <p className="border-4 border-black bg-red-200 p-3 text-sm font-medium text-black shadow-[4px_4px_0_var(--shadow)] whitespace-pre-wrap">{error}</p> : null}
      {preview ? <p className="border-4 border-black bg-emerald-200 p-3 text-sm font-bold text-black shadow-[4px_4px_0_var(--shadow)]">Ready: {preview.quiz.title} ({preview.quiz.questions.length} questions)</p> : null}
    </div>
  );
}
