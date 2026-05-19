import { env } from '@/shared/config/env';

type YmFn = (counterId: number, method: string, ...args: unknown[]) => void;

declare global {
  interface Window {
    ym?: YmFn;
  }
}

let counterId: number | null = null;
let stubReady = false;

export function getMetrikaCounterId(): number | null {
  if (counterId !== null) return counterId;
  const raw = env.VITE_YANDEX_METRIKA_ID.trim();
  if (!raw) return null;
  const id = Number(raw);
  if (!Number.isFinite(id) || id <= 0) return null;
  counterId = id;
  return counterId;
}

export function isMetrikaEnabled(): boolean {
  return getMetrikaCounterId() !== null;
}

function ensureYmStub(): void {
  if (stubReady) return;
  stubReady = true;

  const win = window as Window & { ym?: YmFn & { a?: unknown[]; l?: number } };
  if (typeof win.ym === 'function') return;

  const queueTarget = 'ym';
  const tagUrl = 'https://mc.yandex.ru/metrika/tag.js';

  win[queueTarget] = ((...args: unknown[]) => {
    (win[queueTarget]!.a = win[queueTarget]!.a || []).push(args);
  }) as YmFn & { a?: unknown[]; l?: number };
  win[queueTarget]!.l = Date.now();

  const scripts = document.getElementsByTagName('script');
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i]?.src === tagUrl) return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = tagUrl;
  const first = scripts[0];
  first?.parentNode?.insertBefore(script, first);
}

export function callMetrika(method: string, ...params: unknown[]): void {
  const id = getMetrikaCounterId();
  if (id === null) return;
  ensureYmStub();
  if (typeof window.ym !== 'function') return;
  window.ym(id, method, ...params);
}
