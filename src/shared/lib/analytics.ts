import posthog from 'posthog-js';

import { env } from '@/shared/config/env';

let posthogReady = false;

export function initAnalytics(): void {
  if (posthogReady) return;
  const key = env.VITE_POSTHOG_KEY.trim();
  if (!key) return;
  posthog.init(key, {
    api_host: env.VITE_POSTHOG_HOST || 'https://eu.i.posthog.com',
    capture_pageview: false,
    persistence: 'localStorage',
  });
  posthogReady = true;
}

export function capturePageView(path: string): void {
  if (!env.VITE_POSTHOG_KEY.trim()) return;
  posthog.capture('$pageview', { path });
}

export function captureSearch(query: string): void {
  if (!env.VITE_POSTHOG_KEY.trim()) return;
  posthog.capture('book_search', { query });
}

export function captureFavorite(action: 'add' | 'remove', bookId: string): void {
  if (!env.VITE_POSTHOG_KEY.trim()) return;
  posthog.capture('favorite', { action, bookId });
}

export function identifyUser(userId: string, traits?: Record<string, string>): void {
  if (!env.VITE_POSTHOG_KEY.trim()) return;
  posthog.identify(userId, traits);
}

export function resetAnalytics(): void {
  if (!env.VITE_POSTHOG_KEY.trim()) return;
  posthog.reset();
}
