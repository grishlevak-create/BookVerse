import { cn } from '@/shared/lib/cn';

type SectionProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function Section({ title, subtitle, action, children, className }: SectionProps) {
  return (
    <section className={cn('space-y-4', className)}>
      <div className="flex items-end justify-between gap-4 px-1">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
            {title}
          </h2>
          {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      <div className="w-full min-w-0">{children}</div>
    </section>
  );
}
