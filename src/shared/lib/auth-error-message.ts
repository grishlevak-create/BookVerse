import { ru } from '@/shared/i18n';

/** Человекочитаемое сообщение для ошибок Supabase Auth. */
export function mapAuthErrorMessage(message: string | undefined): string {
  const raw = (message ?? '').trim();
  if (!raw) return ru.auth.unknownError;

  const lower = raw.toLowerCase();

  if (lower.includes('rate limit') || lower.includes('email rate limit')) {
    return ru.auth.emailRateLimit;
  }
  if (lower.includes('already registered') || lower.includes('user already registered')) {
    return ru.auth.alreadyRegistered;
  }
  if (lower.includes('invalid login credentials')) {
    return ru.auth.invalidCredentials;
  }
  if (lower.includes('email not confirmed')) {
    return ru.auth.emailNotConfirmed;
  }

  return raw;
}
