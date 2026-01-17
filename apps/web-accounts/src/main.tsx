import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@repo/core/shared';
import { ErrorBoundary } from '@repo/ui/components/ErrorBoundary';
import { App } from './App';
import './index.css';

const queryClient = createQueryClient();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

/**
 * Standalone entry point for the accounts microfrontend.
 * Uses BrowserRouter for standalone development (no basename - works at root).
 * When integrated via Module Federation, the shell provides the router
 * and mounts this at /accounts/*.
 */
createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
