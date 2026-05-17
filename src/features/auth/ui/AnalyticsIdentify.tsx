import { useEffect } from 'react';

import { identifyUser } from '@/shared/lib/analytics';
import { useAuth } from '@/features/auth/model/use-auth';

export function AnalyticsIdentify() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    identifyUser(user.id, { email: user.email ?? '' });
  }, [user]);

  return null;
}
