import { render, screen } from '@testing-library/react';

import { Section } from '@/shared/ui/Section';

describe('Section', () => {
  it('renders title and children', () => {
    render(
      <Section title="Блок" subtitle="Подзаголовок">
        <p>Контент</p>
      </Section>,
    );
    expect(screen.getByRole('heading', { name: 'Блок' })).toBeInTheDocument();
    expect(screen.getByText('Подзаголовок')).toBeInTheDocument();
    expect(screen.getByText('Контент')).toBeInTheDocument();
  });
});
