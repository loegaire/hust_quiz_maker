interface FillGapQuestionProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function FillGapQuestion({ value, onChange, disabled }: FillGapQuestionProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full rounded-lg border border-black/10 px-4 py-3"
      placeholder="Type your answer"
    />
  );
}
