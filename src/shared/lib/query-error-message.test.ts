import { queryErrorMessage } from '@/shared/lib/query-error-message';

describe('queryErrorMessage', () => {
  it('returns Error message', () => {
    expect(queryErrorMessage(new Error('fail'))).toBe('fail');
  });

  it('stringifies objects', () => {
    expect(queryErrorMessage({ code: 'PGRST301' })).toContain('PGRST301');
  });
});
