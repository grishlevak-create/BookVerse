import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';

import { useBookDetailsQuery, useSimilarBooksQuery } from '@/entities/book/api/use-book-queries';
import { BookToolbar } from '@/features/book-actions/ui/BookToolbar';
import { CreateReviewForm } from '@/features/create-review/ui/CreateReviewForm';
import { useAuth } from '@/features/auth/model/use-auth';
import { useDeleteReview, useBookReviews } from '@/features/reviews/model/use-reviews';
import { ru } from '@/shared/i18n';
import { stripHtml } from '@/shared/lib/html';
import { upgradeHttpToHttpsOnSecurePage } from '@/shared/lib/secure-url';
import { queryErrorMessage } from '@/shared/lib/query-error-message';
import {
  Badge,
  BookCard,
  BookDetailsSkeleton,
  CarouselRow,
  EmptyState,
  QueryErrorState,
  Section,
} from '@/shared/ui';

export default function BookDetailsPage() {
  const params = useParams();
  const rawId = params.id ?? '';
  const bookId = useMemo(() => decodeURIComponent(rawId), [rawId]);

  const query = useBookDetailsQuery(bookId);
  const primarySubject = query.data?.subjects[0];
  const similar = useSimilarBooksQuery(primarySubject);
  const reviews = useBookReviews(bookId);
  const deleteReview = useDeleteReview(bookId);
  const { user } = useAuth();

  const visibleSimilar = useMemo(() => {
    const list = similar.data ?? [];
    const excludeId = query.data?.id ?? bookId;
    return list.filter((b) => b.id !== excludeId).slice(0, 12);
  }, [similar.data, query.data?.id, bookId]);

  if (!bookId) {
    return <EmptyState title={ru.details.invalidIdTitle} description={ru.details.invalidIdText} />;
  }

  if (query.isLoading) {
    return (
      <div className="space-y-6">
        <BookDetailsSkeleton />
      </div>
    );
  }

  if (query.isError) {
    return (
      <QueryErrorState
        message={queryErrorMessage(query.error)}
        onRetry={() => void query.refetch()}
      />
    );
  }

  const book = query.data;
  if (!book) {
    return <EmptyState title={ru.details.notFoundTitle} description={ru.details.notFoundText} />;
  }

  const plainDescription = book.description ? stripHtml(book.description) : '';
  return (
    <div className="space-y-10">
      <Helmet>
        <title>{`${book.title} — ${ru.brand.title}`}</title>
        <meta
          name="description"
          content={plainDescription.slice(0, 160) || ru.details.metaUnknown}
        />
      </Helmet>

      <div className="overflow-hidden rounded-3xl border border-border/60 shadow-glass">
        <div className="relative h-40 sm:h-52 lg:h-64">
          <div className="h-full w-full bg-gradient-to-br from-accent/30 via-slate-900 to-slate-950" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--surface))] via-black/40 to-transparent" />
        </div>

        <div className="relative -mt-16 flex flex-col gap-6 px-4 pb-8 pt-2 sm:px-6 lg:flex-row lg:items-start lg:gap-10 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto w-44 shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-surface-elevated/60 shadow-glass backdrop-blur-xl sm:w-52 lg:mx-0"
          >
            {book.coverUrl ? (
              <img
                src={upgradeHttpToHttpsOnSecurePage(book.coverUrl) ?? book.coverUrl}
                alt=""
                className="aspect-[3/4] w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex aspect-[3/4] items-center justify-center bg-white/5 p-3 text-center text-sm text-slate-400">
                {ru.details.noCover}
              </div>
            )}
          </motion.div>

          <div className="min-w-0 flex-1 space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Open Library
              </p>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
                {book.title}
              </h1>
              {book.authors.length ? (
                <p className="text-sm text-slate-300">
                  <span className="font-medium text-slate-400">{ru.details.authors}: </span>
                  {book.authors.join(', ')}
                </p>
              ) : null}
              {book.publishDate ? (
                <p className="text-sm text-slate-400">
                  {ru.details.published}: {book.publishDate}
                </p>
              ) : null}
            </div>

            <BookToolbar bookId={book.id} />

            {book.subjects.length ? (
              <div className="flex flex-wrap gap-2">
                {book.subjects.slice(0, 12).map((s) => (
                  <Badge key={s} variant="outline">
                    {s}
                  </Badge>
                ))}
              </div>
            ) : null}

            <div className="rounded-2xl border border-border/60 bg-surface-elevated/30 p-4 backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {ru.details.synopsis}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">
                {plainDescription || ru.details.noSynopsis}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Section title={ru.details.similar} subtitle={ru.details.similarSubtitle}>
        {similar.isLoading ? (
          <p className="text-sm text-slate-400">{ru.common.loading}</p>
        ) : similar.isError ? (
          <QueryErrorState
            message={queryErrorMessage(similar.error)}
            onRetry={() => void similar.refetch()}
          />
        ) : visibleSimilar.length === 0 ? (
          <EmptyState
            title={ru.details.similarEmptyTitle}
            description={
              (similar.data?.length ?? 0) > 0 ? ru.details.similarOnlySelf : ru.details.similarEmpty
            }
          />
        ) : (
          <CarouselRow>
            {visibleSimilar.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </CarouselRow>
        )}
      </Section>

      <Section title={ru.details.reviews} subtitle={ru.details.reviewsSubtitle}>
        <CreateReviewForm bookId={book.id} />

        {reviews.isLoading ? (
          <p className="mt-4 text-sm text-slate-400">{ru.common.loading}</p>
        ) : reviews.isError ? (
          <QueryErrorState
            message={queryErrorMessage(reviews.error)}
            onRetry={() => void reviews.refetch()}
          />
        ) : (reviews.data ?? []).length === 0 ? (
          <EmptyState title={ru.details.reviewsEmptyTitle} description={ru.details.reviewsEmpty} />
        ) : (
          <ul className="mt-4 space-y-3">
            {(reviews.data ?? []).map((r) => (
              <li
                key={r.id}
                className="rounded-2xl border border-border/60 bg-surface-elevated/25 p-4 backdrop-blur-xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-50">{r.username ?? 'Reader'}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(r.createdAt).toLocaleString()} · {r.rating}/5
                    </p>
                  </div>
                  {user?.id === r.userId ? (
                    <button
                      type="button"
                      className="text-xs font-semibold text-rose-300 hover:text-rose-200"
                      onClick={() => void deleteReview.mutateAsync(r.id)}
                    >
                      {ru.details.deleteReview}
                    </button>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-slate-200">{r.text}</p>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <div className="flex justify-center">
        <Link className="text-sm font-semibold text-accent hover:text-accent/90" to="/books">
          {ru.details.backToCatalog}
        </Link>
      </div>
    </div>
  );
}
