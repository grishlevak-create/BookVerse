import { patchOpenLibraryHttpsFetch } from '@/shared/lib/patch-openlibrary-fetch';

describe('patchOpenLibraryHttpsFetch', () => {
  const originalFetch = globalThis.fetch;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
    globalThis.fetch = mockFetch;
    Object.defineProperty(window, 'location', {
      value: { ...window.location, protocol: 'https:' },
      configurable: true,
    });
    patchOpenLibraryHttpsFetch();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('rewrites http openlibrary fetch on https page', async () => {
    await fetch('http://openlibrary.org/subjects/fiction.json?details=false&limit=24');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://openlibrary.org/subjects/fiction.json?details=false&limit=24',
      undefined,
    );
  });

  it('leaves non-openlibrary urls unchanged', async () => {
    await fetch('https://example.com/api');

    expect(mockFetch).toHaveBeenCalledWith('https://example.com/api', undefined);
  });
});
