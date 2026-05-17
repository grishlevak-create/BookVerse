import { createClient } from '@supabase/supabase-js';

import { env, isSupabaseConfigured } from '@/shared/config/env';

export const supabase = createClient(
  env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
  env.VITE_SUPABASE_ANON_KEY || 'placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);

export function assertSupabaseConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Copy .env.example to .env and set URL + anon key.',
    );
  }
}
