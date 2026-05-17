import { render, screen } from '@testing-library/react';

import { AppFooter } from '@/widgets/footer/AppFooter';

describe('AppFooter', () => {
  it('links to Open Library API docs', () => {
    render(<AppFooter />);
    const link = screen.getByRole('link', { name: 'Open Library API' });
    expect(link).toHaveAttribute('href', 'https://openlibrary.org/developers/api');
  });
});
