const OPEN_LIBRARY_ORIGIN = 'https://openlibrary.org';

export class OpenLibraryHttpError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'OpenLibraryHttpError';
    this.status = status;
  }
}

export async function openLibraryFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = path.startsWith('http')
    ? path
    : `${OPEN_LIBRARY_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
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
