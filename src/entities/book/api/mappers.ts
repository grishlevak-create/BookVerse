import type { BookDetails, BookSummary } from '@/entities/book/model/types';
import { coverUrlFromEditionOlid, coverUrlFromId } from '@/shared/lib/book-cover-url';

export type OlSearchDoc = {
  key?: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  subject?: string[];
};

export type OlSubjectWork = {
  key?: string;
  title?: string;
  cover_edition_key?: string;
  first_publish_year?: number;
  authors?: { name?: string }[];
};

export function workKeyToId(workKey: string | undefined): string | null {
  if (!workKey) return null;
  const m = workKey.match(/\/works\/(.+)/);
  return m?.[1] ?? null;
}

export function mapSearchDocToSummary(doc: OlSearchDoc): BookSummary | null {
  const id = workKeyToId(doc.key);
  if (!id) return null;
  const title = typeof doc.title === 'string' && doc.title.trim() ? doc.title.trim() : 'Untitled';
  return {
    id,
    title,
    authors: Array.isArray(doc.author_name) ? doc.author_name.filter(Boolean) : [],
    coverUrl: coverUrlFromId(doc.cover_i),
    firstPublishYear: doc.first_publish_year,
    subjects: Array.isArray(doc.subject) ? doc.subject.slice(0, 8) : undefined,
  };
}

export function mapSubjectWorkToSummary(work: OlSubjectWork): BookSummary | null {
  const id = workKeyToId(work.key);
  if (!id) return null;
  const title =
    typeof work.title === 'string' && work.title.trim() ? work.title.trim() : 'Untitled';
  const authors = Array.isArray(work.authors)
    ? (work.authors.map((a) => a.name).filter(Boolean) as string[])
    : [];
  return {
    id,
    title,
    authors,
    coverUrl: coverUrlFromEditionOlid(work.cover_edition_key),
    firstPublishYear: work.first_publish_year,
  };
}

export type OlWorkJson = {
  title?: string;
  description?: string | { value?: string };
  subjects?: string[];
  subject_places?: string[];
  first_publish_date?: string;
  publish_date?: string;
  covers?: number[];
  authors?: { author?: { key?: string }; type?: { key?: string } }[];
};

function pickDescription(raw: OlWorkJson['description']): string | null {
  if (raw == null) return null;
  if (typeof raw === 'string') {
    const t = raw.trim();
    return t.length ? t : null;
  }
  const v = raw.value?.trim();
  return v && v.length ? v : null;
}

export function mapWorkJsonToDetails(
  workId: string,
  work: OlWorkJson,
  authorNames: string[],
): BookDetails {
  const title =
    typeof work.title === 'string' && work.title.trim() ? work.title.trim() : 'Untitled';
  const coverId = Array.isArray(work.covers) && work.covers.length > 0 ? work.covers[0] : undefined;
  const subjects = Array.isArray(work.subjects)
    ? work.subjects.filter((s): s is string => typeof s === 'string')
    : [];
  return {
    id: workId,
    title,
    authors: authorNames,
    coverUrl: coverUrlFromId(coverId),
    firstPublishYear: undefined,
    subjects,
    description: pickDescription(work.description),
    publishDate: work.first_publish_date ?? work.publish_date,
  };
}
