import { renderHook, act } from '@testing-library/react';

import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('updates after delay', () => {
    const { result, rerender } = renderHook(({ v }: { v: string }) => useDebouncedValue(v, 200), {
      initialProps: { v: 'first' },
    });
    expect(result.current).toBe('first');
    rerender({ v: 'second' });
    expect(result.current).toBe('first');
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe('second');
  });
});
