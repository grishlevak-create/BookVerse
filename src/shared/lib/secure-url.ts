const OPEN_LIBRARY_HTTP_HOST = /^http:\/\/((?:covers\.)?openlibrary\.org)/i;

export function ensureOpenLibraryHttps(url: string): string {
  return url.replace(OPEN_LIBRARY_HTTP_HOST, 'https://$1');
}

export function upgradeHttpToHttpsOnSecurePage(url: string | null | undefined): string | null {
  if (url == null || url === '') return null;
  const normalized = ensureOpenLibraryHttps(url);
  if (typeof window === 'undefined' || window.location.protocol !== 'https:') return normalized;
  return normalized.startsWith('http://') ? `https://${normalized.slice(7)}` : normalized;
}
