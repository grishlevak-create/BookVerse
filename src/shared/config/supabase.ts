import { createClient } from '@supabase/supabase-js';

import { env, isSupabaseConfigured } from '@/shared/config/env';

const supabaseUrl = env.VITE_SUPABASE_URL.trim() || 'https://placeholder.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY.trim() || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      apikey: supabaseAnonKey,
    },
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export function assertSupabaseConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Copy .env.example to .env and set URL + anon key.',
    );
  }
}
