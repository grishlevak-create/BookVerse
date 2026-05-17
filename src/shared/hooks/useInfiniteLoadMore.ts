import { useEffect, useRef } from 'react';

type Args = {
  enabled: boolean;
  isFetching: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => unknown;
};

export function useInfiniteLoadMore({ enabled, isFetching, hasNextPage, fetchNextPage }: Args) {
  const ref = useRef<HTMLDivElement>(null);
  const fetchRef = useRef(fetchNextPage);

  useEffect(() => {
    fetchRef.current = fetchNextPage;
  }, [fetchNextPage]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        if (!enabled || isFetching || !hasNextPage) return;
        void fetchRef.current();
      },
      { root: null, rootMargin: '320px 0px', threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, isFetching, hasNextPage]);

  return ref;
}
