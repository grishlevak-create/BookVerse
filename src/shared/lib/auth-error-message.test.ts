import { mapAuthErrorMessage } from '@/shared/lib/auth-error-message';
import { ru } from '@/shared/i18n';

describe('mapAuthErrorMessage', () => {
  it('maps email rate limit', () => {
    expect(mapAuthErrorMessage('email rate limit exceeded')).toBe(ru.auth.emailRateLimit);
  });

  it('returns original message when unknown', () => {
    expect(mapAuthErrorMessage('Custom error')).toBe('Custom error');
  });
});
