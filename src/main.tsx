import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/app/App';
import '@/app/styles/index.css';
import { initErrorMonitoring } from '@/shared/lib/error-monitoring';
import { patchOpenLibraryHttpsFetch } from '@/shared/lib/patch-openlibrary-fetch';

patchOpenLibraryHttpsFetch();
initErrorMonitoring();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
