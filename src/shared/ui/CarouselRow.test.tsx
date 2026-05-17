import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CarouselRow } from '@/shared/ui/CarouselRow';

describe('CarouselRow', () => {
  it('scrolls scroller on button click', async () => {
    const user = userEvent.setup();
    const scrollBy = jest.fn();
    const { container } = render(
      <CarouselRow>
        <div>item</div>
      </CarouselRow>,
    );
    const scroller = screen.getByText('item').parentElement;
    expect(scroller).toBeTruthy();
    if (!scroller) throw new Error('scroller');
    scroller.scrollBy = scrollBy;
    Object.defineProperty(scroller, 'clientWidth', { configurable: true, value: 100 });

    const row = container.firstElementChild;
    expect(row).toBeTruthy();
    await user.hover(row as HTMLElement);
    await user.click(screen.getByRole('button', { name: 'Прокрутить влево' }));
    expect(scrollBy).toHaveBeenCalled();
  });
});
