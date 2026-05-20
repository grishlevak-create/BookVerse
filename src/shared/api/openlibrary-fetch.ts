import { ensureOpenLibraryHttps } from '@/shared/lib/secure-url';

const OPEN_LIBRARY_ORIGIN = 'https://openlibrary.org';

function isOpenLibraryHost(hostname: string): boolean {
  return hostname === 'openlibrary.org' || hostname.endsWith('.openlibrary.org');
}

export function resolveOpenLibraryUrl(path: string): string {
  const trimmed = path.trim();
  const absolute = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `${OPEN_LIBRARY_ORIGIN}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(absolute);
  } catch {
    return ensureOpenLibraryHttps(absolute);
  }

  if (parsed.protocol === 'http:' && isOpenLibraryHost(parsed.hostname)) {
    parsed.protocol = 'https:';
  }

  return ensureOpenLibraryHttps(parsed.toString());
}

export class OpenLibraryHttpError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'OpenLibraryHttpError';
    this.status = status;
  }
}

export async function openLibraryFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = resolveOpenLibraryUrl(path);
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
  });
  if (!res.ok) {
    throw new OpenLibraryHttpError(`Open Library HTTP ${res.status}`, res.status);
  }
  return (await res.json()) as T;
}
