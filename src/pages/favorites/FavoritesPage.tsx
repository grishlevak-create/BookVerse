import { useQueries } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';

import { getBookDetails } from '@/entities/book/api/getBookDetails';
import { BOOK_DETAILS_STALE_MS } from '@/entities/book/api/use-book-queries';
import { bookKeys } from '@/entities/book/model/query-keys';
import { useFavoriteBookIds, useToggleFavorite } from '@/features/favorites/model/use-favorites';
import { ru } from '@/shared/i18n';
import { BookCard, Button, EmptyState, Loader } from '@/shared/ui';

export default function FavoritesPage() {
  const favorites = useFavoriteBookIds();
  const ids = favorites.data ?? [];

  const detailQueries = useQueries({
    queries: ids.map((id) => ({
      queryKey: bookKeys.details(id),
      queryFn: () => getBookDetails(id),
      staleTime: BOOK_DETAILS_STALE_MS,
      enabled: favorites.isSuccess && ids.length > 0,
    })),
  });

  const prefetchStub = useCallback(() => undefined, []);

  const loadingDetails = detailQueries.some((q) => q.isLoading);

  return (
    <div className="space-y-8">
      <Helmet>
        <title>{ru.favorites.metaTitle}</title>
        <meta name="description" content={ru.favorites.metaDescription} />
      </Helmet>

      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-50">
          {ru.favorites.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">{ru.favorites.intro}</p>
      </div>

      {favorites.isLoading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader />
        </div>
      ) : ids.length === 0 ? (
        <EmptyState
          title={ru.favorites.emptyTitle}
          description={ru.favorites.emptyText}
          action={
            <Button asChild variant="primary">
              <Link to="/books">{ru.favorites.browse}</Link>
            </Button>
          }
        />
      ) : loadingDetails ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {ids.map((id, idx) => {
            const q = detailQueries[idx];
            const book = q?.data;
            if (!book) {
              return (
                <div
                  key={id}
                  className="rounded-2xl border border-border/60 bg-surface-elevated/30 p-4"
                >
                  <p className="text-xs text-slate-400">{id}</p>
                  <Button asChild variant="ghost" size="sm" className="mt-2">
                    <Link to={`/books/${encodeURIComponent(id)}`}>Open</Link>
                  </Button>
                </div>
              );
            }
            return (
              <div key={id} className="relative">
                <BookCard book={book} className="w-full" onPrefetchDetails={prefetchStub} />
                <RemoveFavoriteButton bookId={id} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RemoveFavoriteButton({ bookId }: { bookId: string }) {
  const toggle = useToggleFavorite(bookId);
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="absolute right-2 top-2 bg-black/50 text-xs text-slate-100 backdrop-blur"
      onClick={() => toggle.mutate(false)}
    >
      {ru.favorites.remove}
    </Button>
  );
}
