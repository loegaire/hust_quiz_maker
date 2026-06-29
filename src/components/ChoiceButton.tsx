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
      className={`w-full border-4 border-black px-4 py-3 text-left font-medium shadow-[4px_4px_0_var(--shadow)] transition ${
        selected ? 'bg-[var(--accent-soft)]' : 'bg-white hover:bg-[var(--accent-pink)]'
      } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      {content}
    </button>
  );
}
