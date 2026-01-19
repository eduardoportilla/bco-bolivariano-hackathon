import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@repo/core/shared';
import { App } from './App';
import './index.css';

const queryClient = createQueryClient();

/**
 * Enable MSW mocking in development when VITE_API_MOCK is true.
 * This allows development without a backend.
 */
async function enableMocking() {
  if (import.meta.env.VITE_API_MOCK !== 'true') {
    return; // Real mode - no mocking
  }

  const { worker } = await import('@repo/core/test/mocks');
  return worker.start({
    onUnhandledRequest: 'bypass', // Allow non-mocked requests through
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

enableMocking().then(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>
  );
});
