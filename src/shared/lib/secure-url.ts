export function upgradeHttpToHttpsOnSecurePage(url: string | null | undefined): string | null {
  if (url == null || url === '') return null;
  if (typeof window === 'undefined' || window.location.protocol !== 'https:') return url;
  return url.startsWith('http://') ? `https://${url.slice(7)}` : url;
}
