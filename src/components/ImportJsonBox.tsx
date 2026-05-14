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
    <div className="space-y-3 rounded-xl bg-[var(--card)] p-5 shadow-sm">
      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        rows={12}
        className="w-full rounded-lg border border-black/10 p-3 font-mono text-sm"
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
        <button type="button" onClick={validate} className="rounded bg-[var(--accent)] px-4 py-2 text-white">
          Validate
        </button>
        <button type="button" onClick={() => void save()} disabled={!preview} className="rounded bg-black px-4 py-2 text-white disabled:opacity-40">
          Save
        </button>
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {preview ? <p className="text-sm text-emerald-700">Ready: {preview.quiz.title} ({preview.quiz.questions.length} questions)</p> : null}
    </div>
  );
}
