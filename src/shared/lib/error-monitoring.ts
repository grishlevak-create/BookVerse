import { captureError } from '@/shared/lib/analytics';
import { isMetrikaEnabled } from '@/shared/lib/yandex-metrika';

function stackSnippet(stack?: string): string | undefined {
  if (!stack) return undefined;
  return stack.split('\n').slice(0, 5).join('\n').slice(0, 800);
}

export function reportClientError(message: string, stack?: string, source?: string): void {
  console.error('[BookVerse]', message, stack ?? source ?? '');
  if (!isMetrikaEnabled()) return;
  captureError(message, {
    stack: stackSnippet(stack) ?? '',
    source: source ?? 'client',
  });
}

export function initErrorMonitoring(): void {
  if (!isMetrikaEnabled()) return;

  window.addEventListener('error', (event) => {
    const err = event.error;
    reportClientError(
      event.message || (err instanceof Error ? err.message : 'Unknown error'),
      err instanceof Error ? err.stack : undefined,
      'window.error',
    );
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    if (reason instanceof Error) {
      reportClientError(reason.message, reason.stack, 'unhandledrejection');
      return;
    }
    reportClientError(String(reason), undefined, 'unhandledrejection');
  });
}
