import { coverUrlFromEditionOlid, coverUrlFromId } from '@/shared/lib/book-cover-url';

describe('book-cover-url', () => {
  it('builds cover url from numeric id', () => {
    expect(coverUrlFromId(9255568)).toBe('https://covers.openlibrary.org/b/id/9255568-M.jpg');
    expect(coverUrlFromId(undefined)).toBeNull();
  });

  it('builds cover url from OLID', () => {
    expect(coverUrlFromEditionOlid('OL12345678M')).toBe(
      'https://covers.openlibrary.org/b/olid/OL12345678M-M.jpg',
    );
    expect(coverUrlFromEditionOlid('')).toBeNull();
  });
});
