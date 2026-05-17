import { render, act } from '@testing-library/react';

import { useInfiniteLoadMore } from '@/shared/hooks/useInfiniteLoadMore';

describe('useInfiniteLoadMore', () => {
  let lastCallback: IntersectionObserverCallback;

  beforeEach(() => {
    globalThis.IntersectionObserver = jest.fn((cb: IntersectionObserverCallback) => {
      lastCallback = cb;
      return {
        observe: jest.fn(),
        disconnect: jest.fn(),
        unobserve: jest.fn(),
        takeRecords: () => [],
        root: null,
        rootMargin: '',
        thresholds: [],
      } as unknown as IntersectionObserver;
    }) as unknown as typeof IntersectionObserver;
  });

  function Sentinel({
    fetchNextPage,
    enabled = true,
    isFetching = false,
    hasNextPage = true,
  }: {
    fetchNextPage: () => void;
    enabled?: boolean;
    isFetching?: boolean;
    hasNextPage?: boolean;
  }) {
    const ref = useInfiniteLoadMore({ enabled, isFetching, hasNextPage, fetchNextPage });
    return <div ref={ref} data-testid="sentinel" />;
  }

  it('invokes fetch when intersecting', () => {
    const fetchNextPage = jest.fn();
    render(<Sentinel fetchNextPage={fetchNextPage} />);
    expect(IntersectionObserver).toHaveBeenCalled();
    act(() => {
      lastCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });

  it('skips when disabled', () => {
    const fetchNextPage = jest.fn();
    render(<Sentinel fetchNextPage={fetchNextPage} enabled={false} />);
    act(() => {
      lastCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(fetchNextPage).not.toHaveBeenCalled();
  });
});
