import { render } from '@testing-library/react';

import { BookCardSkeleton, BookDetailsSkeleton, Skeleton } from '@/shared/ui/Skeleton';

describe('Skeleton', () => {
  it('renders base skeleton', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
  });

  it('renders composed skeletons', () => {
    const { container: c1 } = render(<BookCardSkeleton />);
    expect(c1.querySelectorAll('div').length).toBeGreaterThan(0);
    const { container: c2 } = render(<BookDetailsSkeleton />);
    expect(c2.textContent).toBe('');
  });
});
