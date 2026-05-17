import { bookKeys } from '@/entities/book/model/query-keys';

describe('bookKeys', () => {
  it('builds stable home key', () => {
    expect(bookKeys.home()).toEqual(['books', 'home']);
  });

  it('builds details key', () => {
    expect(bookKeys.details('OL45883W')).toEqual(['books', 'details', 'OL45883W']);
  });
});
