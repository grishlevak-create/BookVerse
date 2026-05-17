import { ru } from '@/shared/i18n';
import { cn } from '@/shared/lib/cn';

type LoaderProps = {
  className?: string;
  label?: string;
};

export function Loader({ className, label = ru.common.loading }: LoaderProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-3', className)}
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">{label}</span>
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-l-accent/40 border-t-accent" />
      </div>
    </div>
  );
}
