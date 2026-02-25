type AlertVariant = 'success' | 'danger' | 'warning' | 'info';

type AlertProps = {
  variant?: AlertVariant;
  onDismiss?: () => void;
  children: React.ReactNode;
  className?: string;
};

const variantClass: Record<AlertVariant, string> = {
  success: 'alert-success',
  danger: 'alert-danger',
  warning: 'alert-warning',
  info: 'alert-info',
};

export default function Alert({
  variant = 'info',
  onDismiss,
  children,
  className = '',
}: AlertProps) {
  return (
    <div
      className={`alert ${variantClass[variant]} ${onDismiss ? 'alert-dismissible fade show' : ''} ${className}`.trim()}
      role="alert"
    >
      {children}
      {onDismiss && (
        <button
          type="button"
          className="btn-close"
          aria-label="閉じる"
          onClick={onDismiss}
        />
      )}
    </div>
  );
}
