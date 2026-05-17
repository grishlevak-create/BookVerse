import { favoriteKeys } from '@/features/favorites/model/favorite-keys';

describe('favoriteKeys', () => {
  it('builds stable list key per user', () => {
    expect(favoriteKeys.list('user-1')).toEqual(['favorites', 'user-1']);
  });
});
