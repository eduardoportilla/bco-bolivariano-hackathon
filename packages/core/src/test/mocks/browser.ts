import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * MSW browser worker for intercepting requests in development.
 * Call worker.start() to enable mocking.
 */
export const worker = setupWorker(...handlers);
