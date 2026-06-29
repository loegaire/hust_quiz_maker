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
      className="neo-input w-full"
      placeholder="Type your answer"
    />
  );
}
