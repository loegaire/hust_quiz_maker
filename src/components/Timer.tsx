interface TimerProps {
  remainingMs?: number;
}

export function Timer({ remainingMs }: TimerProps) {
  if (remainingMs === undefined) return null;

  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');

  return <div className="rounded bg-black/10 px-3 py-1 text-sm font-medium">Time: {minutes}:{seconds}</div>;
}
