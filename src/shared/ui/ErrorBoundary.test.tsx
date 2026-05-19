import { render, screen } from '@testing-library/react';

import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';

jest.mock('@/shared/lib/error-monitoring', () => ({
  reportClientError: jest.fn(),
}));

function Boom(): null {
  throw new Error('test-error');
}

describe('ErrorBoundary', () => {
  it('shows fallback UI', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );
    expect(screen.getByText(/test-error/)).toBeInTheDocument();
    spy.mockRestore();
  });
});
