import { openLibraryFetch } from '@/shared/api/openlibrary-fetch';

import { mapSubjectWorkToSummary, type OlSubjectWork } from './mappers';

type OlSubjectResponse = {
  works?: OlSubjectWork[];
};

function normalizeSubjectKey(subject: string): string {
  const trimmed = subject.trim();
  const fromUrl = trimmed.match(/openlibrary\.org\/subjects\/([^/?#]+)/i);
  if (fromUrl?.[1]) return decodeURIComponent(fromUrl[1]);
  return trimmed;
}

export async function getSimilarBooks(subject: string) {
  const key = normalizeSubjectKey(subject);
  if (!key) return [];

  const path = `/subjects/${encodeURIComponent(key)}.json?details=false&limit=24`;
  const json = await openLibraryFetch<OlSubjectResponse>(path);
  const works = Array.isArray(json.works) ? json.works : [];
  return works.map(mapSubjectWorkToSummary).filter((b): b is NonNullable<typeof b> => b != null);
}
