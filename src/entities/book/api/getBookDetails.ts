import type { BookDetails } from '@/entities/book/model/types';
import { openLibraryFetch } from '@/shared/api/openlibrary-fetch';

import { mapWorkJsonToDetails, type OlWorkJson } from './mappers';

type OlAuthorDoc = {
  name?: string;
};

async function resolveAuthorNames(work: OlWorkJson): Promise<string[]> {
  const authors = Array.isArray(work.authors) ? work.authors : [];
  const keys = authors
    .map((a) => a.author?.key)
    .filter((k): k is string => typeof k === 'string' && k.includes('/authors/'));

  const names = await Promise.all(
    keys.map(async (key) => {
      const id = key.match(/\/authors\/([^/]+)/)?.[1];
      if (!id) return null;
      try {
        const doc = await openLibraryFetch<OlAuthorDoc>(`/authors/${id}.json`);
        return typeof doc.name === 'string' && doc.name.trim() ? doc.name.trim() : null;
      } catch {
        return null;
      }
    }),
  );

  return names.filter((n): n is string => Boolean(n));
}

export async function getBookDetails(workId: string): Promise<BookDetails> {
  const cleanId = workId.trim();
  const workPath = `/works/${cleanId}.json`;
  const work = await openLibraryFetch<OlWorkJson>(workPath);
  const authorNames = await resolveAuthorNames(work);
  return mapWorkJsonToDetails(cleanId, work, authorNames);
}
