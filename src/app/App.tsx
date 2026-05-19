import { BrowserRouter } from 'react-router-dom';

import { AppProviders } from '@/app/providers/AppProviders';
import { MetrikaRouteListener } from '@/app/providers/MetrikaRouteListener';
import { AppRouter } from '@/app/router/AppRouter';
import { ErrorBoundary } from '@/shared/ui';

function routerBasename(): string | undefined {
  const base = import.meta.env.BASE_URL;
  if (base === '/') return undefined;
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

export function App() {
  return (
    <AppProviders>
      <BrowserRouter basename={routerBasename()}>
        <MetrikaRouteListener />
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
      </BrowserRouter>
    </AppProviders>
  );
}
