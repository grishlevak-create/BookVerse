import { openLibraryFetch } from '@/shared/api/openlibrary-fetch';

import { mapSubjectWorkToSummary, type OlSubjectWork } from './mappers';

type OlSubjectResponse = {
  works?: OlSubjectWork[];
};

export async function getSimilarBooks(subject: string) {
  const key = subject.trim();
  if (!key) return [];

  const path = `/subjects/${encodeURIComponent(key)}.json?details=false&limit=12`;
  const json = await openLibraryFetch<OlSubjectResponse>(path);
  const works = Array.isArray(json.works) ? json.works : [];
  return works.map(mapSubjectWorkToSummary).filter((b): b is NonNullable<typeof b> => b != null);
}
