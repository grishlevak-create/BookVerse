import type { QueryClient } from '@tanstack/react-query';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { bookKeys } from '@/entities/book/model/query-keys';
import type { BookSortOption } from '@/entities/book/api/searchBooks';

import { getBookDetails } from './getBookDetails';
import { getSimilarBooks } from './getSimilarBooks';
import { getTrendingBooks } from './getTrendingBooks';
import { searchBooks } from './searchBooks';

export const BOOK_DETAILS_STALE_MS = 1000 * 60 * 15;

const PAGE_SIZE = 20;

const prefetchTimers = new Map<string, ReturnType<typeof setTimeout>>();

export function prefetchBookDetails(queryClient: QueryClient, workId: string): void {
  const id = workId.trim();
  if (!id) return;
  const prev = prefetchTimers.get(id);
  if (prev) clearTimeout(prev);
  const t = setTimeout(() => {
    prefetchTimers.delete(id);
    void queryClient.prefetchQuery({
      queryKey: bookKeys.details(id),
      queryFn: () => getBookDetails(id),
      staleTime: BOOK_DETAILS_STALE_MS,
    });
  }, 320);
  prefetchTimers.set(id, t);
}

export function useHomeBooksQuery() {
  return useQuery({
    queryKey: bookKeys.home(),
    queryFn: getTrendingBooks,
    staleTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnMount: (query) => {
      const data = query.state.data;
      if (!data) return true;
      const empty =
        data.trending.length === 0 &&
        data.popular.length === 0 &&
        data.recommendations.length === 0;
      return empty || query.state.status === 'error';
    },
  });
}

export function useBookDetailsQuery(workId: string) {
  const id = workId.trim();
  return useQuery({
    queryKey: bookKeys.details(id),
    queryFn: () => getBookDetails(id),
    enabled: Boolean(id),
    staleTime: BOOK_DETAILS_STALE_MS,
    retry: 2,
  });
}

export function useSimilarBooksQuery(subject: string | undefined) {
  const key = subject?.trim() ?? '';
  return useQuery({
    queryKey: bookKeys.similar(key),
    queryFn: () => getSimilarBooks(key),
    enabled: Boolean(key),
    staleTime: 1000 * 60 * 15,
    retry: 1,
  });
}

export type SearchBooksFilters = {
  q: string;
  sort: BookSortOption;
};

export function useSearchBooksInfiniteQuery(filters: SearchBooksFilters) {
  const q = filters.q.trim();
  return useInfiniteQuery({
    queryKey: [...bookKeys.all, 'search-infinite', q, filters.sort] as const,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      searchBooks({ q, page: pageParam, limit: PAGE_SIZE, sort: filters.sort }),
    getNextPageParam: (last) => last.nextPage,
    enabled: true,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}
