import { getTrendingBooks } from '@/entities/book/api/getTrendingBooks';

jest.mock('@/shared/api/openlibrary-fetch', () => ({
  openLibraryFetch: jest.fn(),
}));

import { openLibraryFetch } from '@/shared/api/openlibrary-fetch';

const mockedFetch = openLibraryFetch as jest.MockedFunction<typeof openLibraryFetch>;

describe('getTrendingBooks', () => {
  beforeEach(() => {
    mockedFetch.mockReset();
  });

  it('maps search and subject responses', async () => {
    mockedFetch
      .mockResolvedValueOnce({
        docs: [
          {
            key: '/works/OL1W',
            title: 'Book A',
            author_name: ['Author'],
            cover_i: 1,
          },
        ],
      })
      .mockResolvedValueOnce({
        works: [
          {
            key: '/works/OL2W',
            title: 'Book B',
            cover_edition_key: 'OL123M',
          },
        ],
      })
      .mockResolvedValueOnce({ docs: [] });

    const result = await getTrendingBooks();

    expect(result.trending).toHaveLength(1);
    expect(result.trending[0]?.id).toBe('OL1W');
    expect(result.popular).toHaveLength(1);
    expect(result.recommendations).toHaveLength(0);
  });
});
