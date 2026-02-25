type SpinnerSize = 'sm' | 'md';

type SpinnerProps = {
  size?: SpinnerSize;
  className?: string;
};

export default function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <div
      className={['spinner-border', size === 'sm' ? 'spinner-border-sm' : '', className].filter(Boolean).join(' ')}
      role="status"
      aria-label="読み込み中"
    >
      <span className="visually-hidden">読み込み中</span>
    </div>
  );
}
