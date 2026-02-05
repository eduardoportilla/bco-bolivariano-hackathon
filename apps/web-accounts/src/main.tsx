import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@repo/core/shared';
import { getRouterBasename } from '@repo/core/shared/utils';
import { ErrorBoundary } from '@repo/ui/components/ErrorBoundary';
import { App } from './App';
import './index.css';

const queryClient = createQueryClient();

/**
 * Enable MSW mocking in development when VITE_API_MOCK is true.
 * This allows standalone development without a backend.
 */
async function enableMocking() {
  if (import.meta.env.VITE_API_MOCK !== 'true') {
    return; // Real mode - no mocking
  }

  const { worker } = await import('@repo/core/test/mocks/browser');
  return worker.start({
    onUnhandledRequest: 'warn', // Allow non-mocked requests through
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

/**
 * Standalone entry point for the accounts microfrontend.
 * Uses BrowserRouter for standalone development.
 * When integrated via Module Federation, the shell provides the router
 * and mounts this at /accounts/* (main.tsx is not executed).
 */
enableMocking().then(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter basename={getRouterBasename(import.meta.env.BASE_URL)}>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>
  );
});
