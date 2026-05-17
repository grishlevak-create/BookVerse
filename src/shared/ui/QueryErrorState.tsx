import { AlertCircle } from 'lucide-react';

import { ru } from '@/shared/i18n';

import { Button } from './Button';

type QueryErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

export function QueryErrorState({
  title = ru.errors.queryTitle,
  message,
  onRetry,
}: QueryErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-surface-elevated/40 p-10 text-center backdrop-blur">
      <AlertCircle className="h-10 w-10 text-amber-300" aria-hidden />
      <div>
        <h3 className="font-display text-lg font-semibold text-slate-50">{title}</h3>
        <p className="mt-2 text-sm text-slate-400">{message}</p>
      </div>
      {onRetry ? (
        <Button type="button" variant="secondary" onClick={onRetry}>
          {ru.errors.retryAlt}
        </Button>
      ) : null}
    </div>
  );
}
