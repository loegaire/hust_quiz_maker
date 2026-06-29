import { useEffect, useState } from 'react';
import { db } from '../lib/db';
import { exportAllData, importBackup, type BackupData } from '../lib/exportBackup';

interface UiSettings {
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  showExplanationAfterAnswer: boolean;
  timedModeDefault: boolean;
  darkMode: boolean;
}

const initial: UiSettings = {
  shuffleQuestions: true,
  shuffleChoices: true,
  showExplanationAfterAnswer: true,
  timedModeDefault: false,
  darkMode: false
};

export function SettingsPage() {
  const [settings, setSettings] = useState<UiSettings>(initial);

  useEffect(() => {
    void db.settings.get('ui').then((row) => {
      if (row?.value && typeof row.value === 'object') {
        setSettings((prev) => ({ ...prev, ...(row.value as Partial<UiSettings>) }));
      }
    });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode);
  }, [settings.darkMode]);

  const persist = async (next: UiSettings) => {
    setSettings(next);
    await db.settings.put({ key: 'ui', value: next });
  };

  const doExport = async () => {
    const backup = await exportAllData();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `quiz-app-backup-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImportBackup = async (file: File) => {
    const text = await file.text();
    const json = JSON.parse(text) as BackupData;
    await importBackup(json);
    window.location.reload();
  };

  const clearData = async () => {
    await Promise.all([db.quizPacks.clear(), db.questions.clear(), db.attempts.clear(), db.answers.clear(), db.draftSessions.clear()]);
    window.location.reload();
  };

  return (
    <section className="space-y-4">
      <h1 className="font-display text-3xl">Settings</h1>
      <div className="neo-card space-y-2">
        {(
          [
            ['shuffleQuestions', 'Shuffle questions by default'],
            ['shuffleChoices', 'Shuffle choices by default'],
            ['showExplanationAfterAnswer', 'Show explanation immediately'],
            ['timedModeDefault', 'Timed mode by default'],
            ['darkMode', 'Dark mode']
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings[key]}
              onChange={(e) => void persist({ ...settings, [key]: e.target.checked })}
            />
            {label}
          </label>
        ))}
      </div>

      <div className="neo-card space-y-2">
        <h2 className="font-semibold">Backup</h2>
        <button type="button" className="neo-button" onClick={() => void doExport()}>
          Export backup
        </button>
        <label className="block">
          <span className="mb-1 block text-sm">Import backup</span>
          <input
            type="file"
            accept="application/json,.json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onImportBackup(file);
            }}
          />
        </label>
      </div>

      <button type="button" className="neo-button-danger" onClick={() => void clearData()}>
        Clear local quiz and progress data
      </button>
    </section>
  );
}
