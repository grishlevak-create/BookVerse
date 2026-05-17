import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Modal } from '@/shared/ui/Modal';

describe('Modal', () => {
  let warn: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    warn.mockRestore();
  });

  it('renders title when open', () => {
    const onOpenChange = jest.fn();
    render(
      <Modal open title="Заголовок" onOpenChange={onOpenChange}>
        <p>Тело</p>
      </Modal>,
    );
    expect(screen.getByText('Заголовок')).toBeInTheDocument();
    expect(screen.getByText('Тело')).toBeInTheDocument();
  });

  it('calls onOpenChange when closing', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    render(
      <Modal open title="T" onOpenChange={onOpenChange}>
        x
      </Modal>,
    );
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalled();
  });
});
