import { openLibraryFetch } from '@/shared/api/openlibrary-fetch';

import {
  mapSearchDocToSummary,
  mapSubjectWorkToSummary,
  type OlSearchDoc,
  type OlSubjectWork,
} from './mappers';

type OlSearchResponse = {
  docs: OlSearchDoc[];
};

type OlSubjectResponse = {
  works?: OlSubjectWork[];
};

function uniqById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const it of items) {
    if (seen.has(it.id)) continue;
    seen.add(it.id);
    out.push(it);
  }
  return out;
}

export async function getTrendingBooks() {
  const [trendingRes, popularSubject, recoSearch] = await Promise.all([
    openLibraryFetch<OlSearchResponse>('/search.json?q=subject:fiction&limit=12&sort=rating'),
    openLibraryFetch<OlSubjectResponse>('/subjects/fiction.json?details=false&limit=12'),
    openLibraryFetch<OlSearchResponse>(
      '/search.json?q=subject:classic+literature&limit=12&sort=rating',
    ),
  ]);

  const trending = uniqById(
    trendingRes.docs
      .map(mapSearchDocToSummary)
      .filter((b): b is NonNullable<typeof b> => b != null),
  );

  const popularRaw = Array.isArray(popularSubject.works) ? popularSubject.works : [];
  const popular = uniqById(
    popularRaw.map(mapSubjectWorkToSummary).filter((b): b is NonNullable<typeof b> => b != null),
  );

  const recommendations = uniqById(
    recoSearch.docs.map(mapSearchDocToSummary).filter((b): b is NonNullable<typeof b> => b != null),
  );

  return { trending, popular, recommendations };
}
