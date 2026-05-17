import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Input } from '@/shared/ui/Input';

describe('Input', () => {
  it('accepts typing', async () => {
    const user = userEvent.setup();
    render(<Input defaultValue="" aria-label="Поле" />);
    const el = screen.getByRole('textbox', { name: 'Поле' });
    await user.type(el, 'abc');
    expect(el).toHaveValue('abc');
  });
});
