import { openLibraryFetch } from '@/shared/api/openlibrary-fetch';

import { mapSearchDocToSummary, type OlSearchDoc } from './mappers';

export type BookSortOption = 'relevance' | 'rating' | 'new' | 'old';

export type SearchBooksParams = {
  q: string;
  page: number;
  limit: number;
  sort: BookSortOption;
};

type OlSearchResponse = {
  numFound: number;
  start: number;
  docs: OlSearchDoc[];
};

function sortQuery(sort: BookSortOption): string | undefined {
  if (sort === 'relevance') return undefined;
  if (sort === 'rating') return 'rating';
  if (sort === 'new') return 'new';
  if (sort === 'old') return 'old';
  return undefined;
}

export async function searchBooks(params: SearchBooksParams) {
  const offset = (params.page - 1) * params.limit;
  const sp = new URLSearchParams();
  sp.set('limit', String(params.limit));
  sp.set('offset', String(offset));
  const effectiveQuery = params.q.trim() || 'subject:fiction';
  sp.set('q', effectiveQuery);
  const s = sortQuery(params.sort);
  if (s) sp.set('sort', s);

  const path = `/search.json?${sp.toString()}`;
  const json = await openLibraryFetch<OlSearchResponse>(path);

  const books = json.docs
    .map(mapSearchDocToSummary)
    .filter((b): b is NonNullable<typeof b> => b != null);
  const nextOffset = json.start + json.docs.length;
  const hasMore = nextOffset < json.numFound;

  return {
    books,
    total: json.numFound,
    nextPage: hasMore ? params.page + 1 : undefined,
  };
}
