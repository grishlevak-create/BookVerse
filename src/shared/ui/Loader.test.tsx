import { render, screen } from '@testing-library/react';

import { Loader } from '@/shared/ui/Loader';

describe('Loader', () => {
  it('exposes status role', () => {
    render(<Loader />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('uses custom accessible label', () => {
    render(<Loader label="Загрузка…" />);
    expect(screen.getByText('Загрузка…')).toBeInTheDocument();
  });
});
