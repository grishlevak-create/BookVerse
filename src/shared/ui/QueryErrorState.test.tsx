import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { QueryErrorState } from '@/shared/ui/QueryErrorState';

describe('QueryErrorState', () => {
  it('shows retry when handler passed', async () => {
    const user = userEvent.setup();
    const onRetry = jest.fn();
    render(<QueryErrorState message="Сеть недоступна" onRetry={onRetry} />);
    await user.click(screen.getByRole('button', { name: 'Ещё раз' }));
    expect(onRetry).toHaveBeenCalled();
  });
});
