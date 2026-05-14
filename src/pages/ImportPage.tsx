import { useState } from 'react';
import { ImportJsonBox } from '../components/ImportJsonBox';

export function ImportPage() {
  const [message, setMessage] = useState('');

  return (
    <section className="space-y-4">
      <h1 className="font-display text-3xl">Import Quiz</h1>
      <ImportJsonBox onImported={() => setMessage('Quiz imported successfully.')} />
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
    </section>
  );
}
