import { setupServer } from 'msw/native';
import { handlers } from './handlers';

type SetupServerReturnType = ReturnType<typeof setupServer>;

/**
 * MSW server for React Native apps.
 * Uses msw/native which works with fetch in React Native environments.
 */
export const server: SetupServerReturnType = setupServer(...handlers);
