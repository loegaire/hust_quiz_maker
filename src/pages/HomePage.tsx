import { useState } from 'react';
import { Link } from 'react-router-dom';
import { parseQuizJson, saveImportedQuiz } from '../lib/importQuiz';

function quizAssetPath(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}

export function HomePage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadExams = async () => {
    try {
      setLoading(true);
      setMessage('Loading index...');
      const res = await fetch(quizAssetPath('quizzes/index.json'));
      if (!res.ok) {
        throw new Error(`Could not load quiz index (${res.status})`);
      }
      const files: string[] = await res.json();
      
      let loaded = 0;
      let failed = 0;
      for (const file of files) {
        setMessage(`Importing ${file}... (${loaded}/${files.length})`);
        const qRes = await fetch(quizAssetPath(`quizzes/${encodeURIComponent(file)}`));
        if (!qRes.ok) {
          failed++;
          console.error(`Failed to fetch ${file}: ${qRes.status}`);
          continue;
        }
        const text = await qRes.text();
        try {
          const parsed = parseQuizJson(text);
          await saveImportedQuiz(parsed);
          loaded++;
        } catch (e) {
          failed++;
          console.error(`Failed to import ${file}:`, e);
        }
      }
      setMessage(`Loaded ${loaded} exams${failed ? `, ${failed} failed` : ''}. Go to Open Library to view them.`);
    } catch (e) {
      console.error(e);
      setMessage('Error loading exams.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div className="neo-card md:col-span-2">
        <h1 className="font-display text-3xl">Local-First Quiz App</h1>
        <p className="mt-2 text-[var(--muted)]">Import JSON quizzes, study in practice/exam modes, and keep progress in your browser.</p>
        
        <div className="neo-panel mt-4 bg-[var(--accent-blue)]">
          <h3 className="font-bold mb-2">Automated Course Exams (20201 - 20252)</h3>
          <p className="text-sm mb-3">One-click import for all parsed exams from AI, MMT, KTLT, and Database.</p>
          <button 
            onClick={loadExams} 
            disabled={loading}
            className="neo-button bg-[var(--accent-pink)] disabled:opacity-50"
          >
            {loading ? 'Importing...' : 'Auto-Load All Course Exams'}
          </button>
          {message && <p className="mt-2 text-sm font-bold text-black">{message}</p>}
        </div>
      </div>
      <Link to="/library" className="neo-card block transition hover:translate-x-1 hover:translate-y-1">
        <h2 className="font-display text-xl">Open Library</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Start built-in or imported quizzes.</p>
      </Link>
      <Link to="/import" className="neo-card block transition hover:translate-x-1 hover:translate-y-1">
        <h2 className="font-display text-xl">Import Quiz</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Paste JSON or upload .json files.</p>
      </Link>
      <Link to="/review" className="neo-card block transition hover:translate-x-1 hover:translate-y-1">
        <h2 className="font-display text-xl">Review Attempts</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">See previous scores and incorrect answers.</p>
      </Link>
      <Link to="/settings" className="neo-card block transition hover:translate-x-1 hover:translate-y-1">
        <h2 className="font-display text-xl">Settings & Backup</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Shuffle, timed defaults, dark mode, export/import backup.</p>
      </Link>
    </section>
  );
}
