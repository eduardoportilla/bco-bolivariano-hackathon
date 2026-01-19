import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

type SetupWorkerReturnType = ReturnType<typeof setupWorker>;

/**
 * MSW browser worker for intercepting requests in development.
 * Call worker.start() to enable mocking.
 */
export const worker: SetupWorkerReturnType = setupWorker(...handlers);
