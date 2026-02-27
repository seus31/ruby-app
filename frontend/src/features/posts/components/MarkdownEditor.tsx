'use client';

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
  id?: string;
};

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = '',
  minHeight = '300px',
  className = '',
  id,
}: MarkdownEditorProps) {
  return (
    <textarea
      id={id}
      className={['form-control font-monospace', className].filter(Boolean).join(' ')}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={15}
      style={{ minHeight }}
      spellCheck={false}
    />
  );
}
