import { z } from 'zod';

const schema = z.object({
  VITE_SUPABASE_URL: z.string().optional().default(''),
  VITE_SUPABASE_ANON_KEY: z.string().optional().default(''),
  VITE_YANDEX_METRIKA_ID: z.string().optional().default(''),
});

export type AppEnv = z.infer<typeof schema>;

export const env: AppEnv = schema.parse(import.meta.env);

function isPlaceholderSupabase(url: string, anonKey: string): boolean {
  const u = url.trim().toLowerCase();
  const k = anonKey.trim().toLowerCase();
  if (u.includes('your_project') || u.includes('placeholder.supabase')) return true;
  if (k.includes('your_anon') || k === 'placeholder') return true;
  return false;
}

export function isSupabaseConfigured(): boolean {
  const url = env.VITE_SUPABASE_URL.trim();
  const key = env.VITE_SUPABASE_ANON_KEY.trim();
  if (!url || !key) return false;
  if (isPlaceholderSupabase(url, key)) return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
  } catch {
    return false;
  }
  return true;
}
