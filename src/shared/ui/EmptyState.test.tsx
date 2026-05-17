import { render, screen } from '@testing-library/react';

import { EmptyState } from '@/shared/ui/EmptyState';

describe('EmptyState', () => {
  it('renders title and optional parts', () => {
    render(
      <EmptyState
        title="Пусто"
        description="Добавьте элементы"
        action={<button type="button">Действие</button>}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Пусто' })).toBeInTheDocument();
    expect(screen.getByText('Добавьте элементы')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Действие' })).toBeInTheDocument();
  });
});
