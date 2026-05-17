import { render, screen } from '@testing-library/react';

import { Badge } from '@/shared/ui/Badge';

describe('Badge', () => {
  it('renders variants', () => {
    const { rerender } = render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
    rerender(<Badge variant="accent">Hot</Badge>);
    expect(screen.getByText('Hot')).toBeInTheDocument();
  });
});
