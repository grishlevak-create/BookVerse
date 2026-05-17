import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

import { AuthProvider } from '@/features/auth/model/auth-provider';
import { AnalyticsIdentify } from '@/features/auth/ui/AnalyticsIdentify';
import { createQueryClient } from '@/shared/lib/query-client';

const queryClient = createQueryClient();

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AnalyticsIdentify />
          {children}
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
