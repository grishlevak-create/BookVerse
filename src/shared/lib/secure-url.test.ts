import { upgradeHttpToHttpsOnSecurePage } from '@/shared/lib/secure-url';

describe('upgradeHttpToHttpsOnSecurePage', () => {
  const origProtocol = window.location.protocol;

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: { ...window.location, protocol: origProtocol },
      configurable: true,
    });
  });

  it('returns null for empty', () => {
    expect(upgradeHttpToHttpsOnSecurePage('')).toBeNull();
    expect(upgradeHttpToHttpsOnSecurePage(null)).toBeNull();
    expect(upgradeHttpToHttpsOnSecurePage(undefined)).toBeNull();
  });

  it('upgrades http to https on https page', () => {
    Object.defineProperty(window, 'location', {
      value: { ...window.location, protocol: 'https:' },
      configurable: true,
    });
    expect(upgradeHttpToHttpsOnSecurePage('http://covers.openlibrary.org/b/id/1-M.jpg')).toBe(
      'https://covers.openlibrary.org/b/id/1-M.jpg',
    );
  });

  it('leaves http on http page', () => {
    Object.defineProperty(window, 'location', {
      value: { ...window.location, protocol: 'http:' },
      configurable: true,
    });
    expect(upgradeHttpToHttpsOnSecurePage('http://example.com/x')).toBe('http://example.com/x');
  });

  it('leaves https unchanged on https page', () => {
    Object.defineProperty(window, 'location', {
      value: { ...window.location, protocol: 'https:' },
      configurable: true,
    });
    expect(upgradeHttpToHttpsOnSecurePage('https://example.com/x')).toBe('https://example.com/x');
  });
});
