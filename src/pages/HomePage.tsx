import { useState } from 'react';
import { Link } from 'react-router-dom';
import { parseQuizJson, saveImportedQuiz } from '../lib/importQuiz';
import { quizAssets } from '../lib/quizCatalog';

const heroImageUrl = `${import.meta.env.BASE_URL}brand/img2.jpg`;
const bundleImageUrl = `${import.meta.env.BASE_URL}brand/img.jpg`;

export function HomePage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadExams = async () => {
    try {
      setLoading(true);
      setMessage('Loading quizzes...');
      
      let loaded = 0;
      let failed = 0;
      for (const asset of quizAssets) {
        setMessage(`Importing ${asset.filename}... (${loaded}/${quizAssets.length})`);
        const qRes = await fetch(asset.url);
        if (!qRes.ok) {
          failed++;
          console.error(`Failed to fetch ${asset.filename}: ${qRes.status}`);
          continue;
        }
        const text = await qRes.text();
        try {
          const parsed = parseQuizJson(text);
          await saveImportedQuiz(parsed);
          loaded++;
        } catch (e) {
          failed++;
          console.error(`Failed to import ${asset.filename}:`, e);
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
      <div className="neo-card relative min-h-64 overflow-hidden md:col-span-2">
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 hidden w-1/2 border-l-4 border-black bg-cover bg-center opacity-90 md:block"
          style={{ backgroundImage: `url("${heroImageUrl}")` }}
        />
        <div className="relative max-w-xl bg-[var(--card)]/95 pr-0 md:pr-8">
          <h1 className="font-display text-3xl">Local-First Quiz App</h1>
          <p className="mt-2 text-[var(--muted)]">Import JSON quizzes, study in practice/exam modes, and keep progress in your browser.</p>
        </div>
        
        <div className="neo-panel relative mt-4 max-w-xl overflow-hidden bg-[var(--accent-blue)]">
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-0 hidden w-40 border-l-4 border-black bg-cover bg-center opacity-75 sm:block"
            style={{ backgroundImage: `url("${bundleImageUrl}")` }}
          />
          <div className="relative max-w-sm">
            <h3 className="font-bold mb-2">Quiz Bundle</h3>
            <p className="text-sm mb-3">One-click import for every quiz JSON bundled with the site.</p>
            <button
              onClick={loadExams}
              disabled={loading}
              className="neo-button bg-[var(--accent-pink)] disabled:opacity-50"
            >
              {loading ? 'Importing...' : 'Load All Quizzes'}
            </button>
            {message && <p className="mt-2 text-sm font-bold text-black">{message}</p>}
          </div>
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
