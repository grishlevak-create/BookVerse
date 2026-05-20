import { ensureOpenLibraryHttps } from '@/shared/lib/secure-url';

function rewriteOpenLibraryFetchUrl(raw: string): string {
  const normalized = ensureOpenLibraryHttps(raw);
  if (/^http:\/\/([^/]*\.)?openlibrary\.org/i.test(normalized)) {
    return `https://${normalized.slice(7)}`;
  }
  return normalized;
}

export function patchOpenLibraryHttpsFetch(): void {
  if (typeof window === 'undefined' || window.location.protocol !== 'https:') return;

  const nativeFetch = window.fetch.bind(window);

  window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === 'string') {
      return nativeFetch(rewriteOpenLibraryFetchUrl(input), init);
    }
    if (input instanceof URL) {
      const url = rewriteOpenLibraryFetchUrl(input.href);
      return nativeFetch(url === input.href ? input : url, init);
    }
    if (input instanceof Request) {
      const url = rewriteOpenLibraryFetchUrl(input.url);
      if (url === input.url) return nativeFetch(input, init);
      return nativeFetch(new Request(url, input), init);
    }
    return nativeFetch(input, init);
  }) as typeof fetch;
}
