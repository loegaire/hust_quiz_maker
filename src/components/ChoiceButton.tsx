import type { ReactNode } from 'react';

interface ChoiceButtonProps {
  content: ReactNode;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function ChoiceButton({ content, selected, onClick, disabled }: ChoiceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-lg border px-4 py-3 text-left transition ${
        selected ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-black/10 bg-white/50 hover:border-[var(--accent)]'
      } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      {content}
    </button>
  );
}
