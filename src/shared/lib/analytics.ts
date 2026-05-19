import { callMetrika, getMetrikaCounterId, isMetrikaEnabled } from '@/shared/lib/yandex-metrika';

let initialized = false;

export function initAnalytics(): void {
  if (initialized || !isMetrikaEnabled()) return;
  initialized = true;
  callMetrika('init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: false,
  });
}

export function capturePageView(path: string): void {
  if (!isMetrikaEnabled()) return;
  const url = path.startsWith('http') ? path : `${window.location.origin}${path}`;
  callMetrika('hit', url, { title: document.title });
}

export function captureSearch(query: string): void {
  if (!isMetrikaEnabled()) return;
  callMetrika('reachGoal', 'book_search', { query });
}

export function captureFavorite(action: 'add' | 'remove', bookId: string): void {
  if (!isMetrikaEnabled()) return;
  callMetrika('reachGoal', 'favorite', { action, bookId });
}

export function identifyUser(userId: string, traits?: Record<string, string>): void {
  if (!isMetrikaEnabled()) return;
  callMetrika('userParams', { UserID: userId, ...traits });
}

export function captureError(message: string, details?: Record<string, string>): void {
  if (!isMetrikaEnabled()) return;
  const id = getMetrikaCounterId();
  callMetrika('reachGoal', 'js_error', {
    message: message.slice(0, 500),
    ...details,
    counter: String(id ?? ''),
  });
}

export function resetAnalytics(): void {}
