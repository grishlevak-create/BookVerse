import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Controller, useForm } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import {
  prefetchBookDetails,
  useSearchBooksInfiniteQuery,
} from '@/entities/book/api/use-book-queries';
import type { BookSortOption } from '@/entities/book/api/searchBooks';
import { BOOK_SORT_OPTIONS, SUBJECT_FILTER_OPTIONS } from '@/features/book-filters/config';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { useInfiniteLoadMore } from '@/shared/hooks/useInfiniteLoadMore';
import { ru } from '@/shared/i18n';
import { captureSearch } from '@/shared/lib/analytics';
import { queryErrorMessage } from '@/shared/lib/query-error-message';
import {
  Badge,
  BookCard,
  BookCardSkeleton,
  Button,
  EmptyState,
  Input,
  QueryErrorState,
} from '@/shared/ui';

const filtersSchema = z.object({
  sort: z.enum(['relevance', 'rating', 'new', 'old']),
  subjects: z.array(z.string()),
});

type FiltersForm = z.infer<typeof filtersSchema>;

function readFilters(params: URLSearchParams): FiltersForm {
  const subjects = (params.get('subjects') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const sortRaw = params.get('sort') ?? 'relevance';
  const sort = (
    ['relevance', 'rating', 'new', 'old'].includes(sortRaw) ? sortRaw : 'relevance'
  ) as BookSortOption;
  return { sort, subjects };
}

function writeFilters(values: FiltersForm): URLSearchParams {
  const next = new URLSearchParams();
  if (values.sort && values.sort !== 'relevance') next.set('sort', values.sort);
  if (values.subjects.length) next.set('subjects', values.subjects.join(','));
  return next;
}

function buildQuery(base: string, subjects: string[]): string {
  const subjectPart = subjects.map((s) => `subject:${s}`).join(' ');
  return [base.trim(), subjectPart].filter(Boolean).join(' ');
}

export default function BooksPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryInput, setQueryInput] = useState(() => searchParams.get('q') ?? '');
  const debouncedQuery = useDebouncedValue(queryInput, 350);

  const filterKey = useMemo(() => {
    return [searchParams.get('sort') ?? '', searchParams.get('subjects') ?? ''].join('|');
  }, [searchParams]);

  const filters = useMemo(() => {
    const params = new URLSearchParams();
    const [sort, subjects] = filterKey.split('|');
    if (sort) params.set('sort', sort);
    if (subjects) params.set('subjects', subjects);
    return readFilters(params);
  }, [filterKey]);

  const form = useForm<FiltersForm>({
    resolver: zodResolver(filtersSchema),
    defaultValues: filters,
  });

  useEffect(() => {
    form.reset(filters);
  }, [filterKey, filters, form]);

  useEffect(() => {
    const q = debouncedQuery.trim();
    if (q.length >= 2) captureSearch(q);
  }, [debouncedQuery]);

  const composedQuery = useMemo(
    () => buildQuery(debouncedQuery, filters.subjects),
    [debouncedQuery, filters.subjects],
  );

  const infinite = useSearchBooksInfiniteQuery({
    q: composedQuery,
    sort: filters.sort,
  });

  const prefetchDetails = useCallback(
    (id: string) => prefetchBookDetails(queryClient, id),
    [queryClient],
  );

  const items = useMemo(() => {
    return infinite.data?.pages.flatMap((p) => p.books) ?? [];
  }, [infinite.data?.pages]);

  const loadMoreRef = useInfiniteLoadMore({
    enabled: infinite.isSuccess,
    isFetching: infinite.isFetchingNextPage,
    hasNextPage: Boolean(infinite.hasNextPage),
    fetchNextPage: () => void infinite.fetchNextPage(),
  });

  const onApplyFilters = form.handleSubmit((values) => {
    const next = writeFilters(values);
    const q = debouncedQuery.trim();
    if (q) next.set('q', q);
    setSearchParams(next, { replace: true });
  });

  const onResetFilters = () => {
    form.reset({ sort: 'relevance', subjects: [] });
    const next = new URLSearchParams();
    if (debouncedQuery.trim()) next.set('q', debouncedQuery.trim());
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    const q = debouncedQuery.trim();
    if (q) next.set('q', q);
    else next.delete('q');
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [debouncedQuery, searchParams, setSearchParams]);

  return (
    <div className="space-y-8">
      <Helmet>
        <title>{ru.catalog.metaTitle}</title>
        <meta name="description" content={ru.catalog.metaDescription} />
      </Helmet>

      <div className="rounded-3xl border border-border/60 bg-surface-elevated/30 p-4 shadow-glass backdrop-blur-xl sm:p-6">
        <label
          className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400"
          htmlFor="book-search"
        >
          {ru.catalog.label}
        </label>
        <Input
          id="book-search"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          placeholder={ru.catalog.placeholder}
          autoComplete="off"
        />
      </div>

      <div className="grid min-w-0 gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <form
          className="h-fit space-y-4 rounded-3xl border border-border/60 bg-surface-elevated/30 p-4 shadow-glass backdrop-blur-xl lg:sticky lg:top-24"
          onSubmit={onApplyFilters}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="font-display text-sm font-semibold text-slate-100">
              {ru.catalog.filters}
            </p>
            <Button type="button" variant="ghost" size="sm" onClick={onResetFilters}>
              {ru.catalog.reset}
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-400">{ru.catalog.sort}</p>
            <Controller
              control={form.control}
              name="sort"
              render={({ field }) => (
                <select
                  {...field}
                  className="h-11 w-full rounded-xl border border-border bg-surface-elevated/50 px-3 text-sm text-slate-100"
                >
                  {BOOK_SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-400">{ru.catalog.subjects}</p>
            <Controller
              control={form.control}
              name="subjects"
              render={({ field }) => (
                <div className="flex max-h-44 flex-wrap gap-2 overflow-y-auto pr-1">
                  {SUBJECT_FILTER_OPTIONS.map((s) => {
                    const active = field.value.includes(s.value);
                    return (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => {
                          const next = active
                            ? field.value.filter((x) => x !== s.value)
                            : [...field.value, s.value];
                          field.onChange(next);
                        }}
                        className="rounded-full"
                      >
                        <Badge variant={active ? 'accent' : 'outline'}>{s.label}</Badge>
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </div>

          <Button type="submit" className="w-full">
            {ru.catalog.apply}
          </Button>
        </form>

        <div className="min-w-0 space-y-4">
          {infinite.isError ? (
            <QueryErrorState
              message={queryErrorMessage(infinite.error)}
              onRetry={() => void infinite.refetch()}
            />
          ) : infinite.isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <BookCardSkeleton key={i} className="w-full" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState title={ru.catalog.emptyTitle} description={ru.catalog.emptyDescription} />
          ) : (
            <>
              <p className="text-sm text-slate-400">
                {ru.catalog.showing}{' '}
                <span className="font-semibold text-slate-200">{items.length}</span>{' '}
                {ru.catalog.books}
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {items.map((b) => (
                  <BookCard
                    key={b.id}
                    book={b}
                    className="w-full"
                    onPrefetchDetails={prefetchDetails}
                  />
                ))}
              </div>

              <div ref={loadMoreRef} className="flex justify-center py-6">
                {infinite.isFetchingNextPage ? (
                  <p className="text-sm text-slate-400">{ru.catalog.loadingMore}</p>
                ) : null}
                {!infinite.hasNextPage ? (
                  <p className="text-sm text-slate-500">{ru.catalog.endResults}</p>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
