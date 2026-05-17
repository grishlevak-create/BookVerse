import { OpenLibraryHttpError, openLibraryFetch } from '@/shared/api/openlibrary-fetch';

describe('openLibraryFetch', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = jest.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.resetAllMocks();
  });

  it('throws on non-ok response', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(openLibraryFetch('/search.json?q=test')).rejects.toBeInstanceOf(
      OpenLibraryHttpError,
    );
  });

  it('returns json on success', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ docs: [] }),
    });

    await expect(openLibraryFetch<{ docs: unknown[] }>('/search.json?q=test')).resolves.toEqual({
      docs: [],
    });
  });
});
