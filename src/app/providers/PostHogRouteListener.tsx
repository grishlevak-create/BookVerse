import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { capturePageView, initAnalytics } from '@/shared/lib/analytics';

export function PostHogRouteListener() {
  const location = useLocation();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    capturePageView(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  return null;
}
