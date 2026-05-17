import type { Session, User } from '@supabase/supabase-js';
import { createContext } from 'react';

export type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
