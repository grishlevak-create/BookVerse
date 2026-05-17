import { cn } from '@/shared/lib/cn';

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface-elevated/30 px-6 py-16 text-center backdrop-blur',
        className,
      )}
    >
      {icon ? <div className="mb-4 text-slate-400">{icon}</div> : null}
      <h3 className="font-display text-lg font-semibold text-slate-100">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm text-slate-400">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
