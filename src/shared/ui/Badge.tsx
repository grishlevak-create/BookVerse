import { cn } from '@/shared/lib/cn';

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'outline' | 'accent';
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-white/10 text-slate-100',
        variant === 'outline' && 'border border-border text-slate-200',
        variant === 'accent' && 'bg-accent/15 text-accent',
        className,
      )}
      {...props}
    />
  );
}
