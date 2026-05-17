import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button } from '@/shared/ui/Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button type="button">Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('forwards click', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Button type="button" onClick={onClick}>
        Go
      </Button>,
    );
    await user.click(screen.getByRole('button', { name: 'Go' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
