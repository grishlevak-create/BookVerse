jest.mock('@/shared/config/env', () => ({
  env: { VITE_YANDEX_METRIKA_ID: '' },
}));

import { getMetrikaCounterId, isMetrikaEnabled } from '@/shared/lib/yandex-metrika';

describe('yandex-metrika', () => {
  it('returns null when counter id is empty', () => {
    expect(getMetrikaCounterId()).toBeNull();
    expect(isMetrikaEnabled()).toBe(false);
  });
});
