import { collectionKeys } from '@/features/collections/model/collection-keys';

describe('collectionKeys', () => {
  it('builds list and books keys', () => {
    expect(collectionKeys.list('u1')).toEqual(['collections', 'u1']);
    expect(collectionKeys.books('col-1')).toEqual(['collections', 'books', 'col-1']);
  });
});
