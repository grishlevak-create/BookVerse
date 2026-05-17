import { searchBooks } from '@/entities/book/api/searchBooks';

jest.mock('@/shared/api/openlibrary-fetch', () => ({
  openLibraryFetch: jest.fn(),
}));

import { openLibraryFetch } from '@/shared/api/openlibrary-fetch';

const mockedFetch = openLibraryFetch as jest.MockedFunction<typeof openLibraryFetch>;

describe('searchBooks', () => {
  beforeEach(() => {
    mockedFetch.mockReset();
  });

  it('requests with sort and maps docs', async () => {
    mockedFetch.mockResolvedValue({
      numFound: 100,
      start: 0,
      docs: [
        {
          key: '/works/OL9W',
          title: 'Nine',
          author_name: ['A'],
        },
      ],
    });

    const result = await searchBooks({ q: 'test', page: 1, limit: 20, sort: 'rating' });

    expect(mockedFetch).toHaveBeenCalledWith(expect.stringContaining('sort=rating'));
    expect(result.books).toHaveLength(1);
    expect(result.nextPage).toBe(2);
  });

  it('uses default query when empty', async () => {
    mockedFetch.mockResolvedValue({
      numFound: 0,
      start: 0,
      docs: [],
    });

    await searchBooks({ q: '  ', page: 1, limit: 10, sort: 'relevance' });

    expect(mockedFetch).toHaveBeenCalledWith(expect.stringContaining('subject%3Afiction'));
  });
});
