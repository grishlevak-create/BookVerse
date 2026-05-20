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

  it('upgrades http openlibrary url on https page', async () => {
    Object.defineProperty(window, 'location', {
      value: { ...window.location, protocol: 'https:' },
      configurable: true,
    });
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ works: [] }),
    });

    await openLibraryFetch('http://openlibrary.org/subjects/magic.json?details=false&limit=24');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://openlibrary.org/subjects/magic.json?details=false&limit=24',
      expect.any(Object),
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
