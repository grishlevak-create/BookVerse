import { useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';

import { prefetchBookDetails, useHomeBooksQuery } from '@/entities/book/api/use-book-queries';
import { ru } from '@/shared/i18n';
import { queryErrorMessage } from '@/shared/lib/query-error-message';
import { BookCard, BookCardSkeleton, CarouselRow, QueryErrorState, Section } from '@/shared/ui';

function hasAnyBooks(data: {
  trending: unknown[];
  popular: unknown[];
  recommendations: unknown[];
}): boolean {
  return data.trending.length > 0 || data.popular.length > 0 || data.recommendations.length > 0;
}

export default function HomePage() {
  const queryClient = useQueryClient();
  const home = useHomeBooksQuery();
  const { data: homeData, isFetching, isPending, refetch: refetchHome } = home;
  const prefetchDetails = useCallback(
    (id: string) => prefetchBookDetails(queryClient, id),
    [queryClient],
  );

  useEffect(() => {
    if (!homeData && !isFetching && !isPending) {
      void refetchHome();
    }
  }, [homeData, isFetching, isPending, refetchHome]);

  const trendingList = homeData?.trending ?? [];
  const popularList = homeData?.popular ?? [];
  const recoList = homeData?.recommendations ?? [];
  const showSkeleton = !homeData && (isPending || isFetching);
  const showContent = Boolean(homeData && hasAnyBooks(homeData));

  return (
    <div className="space-y-12">
      <Helmet>
        <title>{ru.home.metaTitle}</title>
        <meta name="description" content={ru.home.metaDescription} />
      </Helmet>

      <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-surface-elevated/70 to-surface/40 p-6 shadow-glass backdrop-blur-xl sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {ru.home.kicker}
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
          {ru.home.heroTitle}
        </h1>
      </div>

      {home.isError && !homeData ? (
        <QueryErrorState
          message={queryErrorMessage(home.error)}
          onRetry={() => void refetchHome()}
        />
      ) : showSkeleton ? (
        <>
          <Section title={ru.home.trendingTitle} subtitle={ru.home.trendingSubtitle}>
            <CarouselRow>
              {Array.from({ length: 6 }).map((_, i) => (
                <BookCardSkeleton key={i} />
              ))}
            </CarouselRow>
          </Section>
          <Section title={ru.home.popularTitle} subtitle={ru.home.popularSubtitle}>
            <CarouselRow>
              {Array.from({ length: 6 }).map((_, i) => (
                <BookCardSkeleton key={i} />
              ))}
            </CarouselRow>
          </Section>
          <Section title={ru.home.recoTitle} subtitle={ru.home.recoSubtitle}>
            <CarouselRow>
              {Array.from({ length: 6 }).map((_, i) => (
                <BookCardSkeleton key={i} />
              ))}
            </CarouselRow>
          </Section>
        </>
      ) : showContent ? (
        <>
          <Section title={ru.home.trendingTitle} subtitle={ru.home.trendingSubtitle}>
            <CarouselRow>
              {trendingList.map((b) => (
                <BookCard key={b.id} book={b} onPrefetchDetails={prefetchDetails} />
              ))}
            </CarouselRow>
          </Section>

          <Section title={ru.home.popularTitle} subtitle={ru.home.popularSubtitle}>
            <CarouselRow>
              {popularList.map((b) => (
                <BookCard key={b.id} book={b} onPrefetchDetails={prefetchDetails} />
              ))}
            </CarouselRow>
          </Section>

          <Section title={ru.home.recoTitle} subtitle={ru.home.recoSubtitle}>
            <CarouselRow>
              {recoList.map((b) => (
                <BookCard key={b.id} book={b} onPrefetchDetails={prefetchDetails} />
              ))}
            </CarouselRow>
          </Section>
        </>
      ) : (
        <QueryErrorState
          message={queryErrorMessage(home.error ?? new Error('No data'))}
          onRetry={() => void refetchHome()}
        />
      )}
    </div>
  );
}
