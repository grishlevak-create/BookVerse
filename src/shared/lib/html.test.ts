import { stripHtml } from './html';

describe('stripHtml', () => {
  it('returns plain text from simple markup', () => {
    expect(stripHtml('<p>Hello <strong>world</strong></p>')).toBe('Hello world');
  });

  it('returns empty string for empty input', () => {
    expect(stripHtml('')).toBe('');
  });
});
