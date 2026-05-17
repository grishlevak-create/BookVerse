/** Medium cover from Open Library cover id (search API `cover_i`). */
export function coverUrlFromId(coverId: number | undefined): string | null {
  if (!coverId || !Number.isFinite(coverId)) return null;
  return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
}

/** Cover from edition OLID (`cover_edition_key` from subject API). */
export function coverUrlFromEditionOlid(olid: string | undefined): string | null {
  if (!olid || typeof olid !== 'string') return null;
  const trimmed = olid.trim();
  if (!trimmed) return null;
  return `https://covers.openlibrary.org/b/olid/${trimmed}-M.jpg`;
}
