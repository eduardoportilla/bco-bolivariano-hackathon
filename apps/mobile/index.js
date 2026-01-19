/**
 * @format
 */

import { AppRegistry } from 'react-native';
import Config from 'react-native-config';
import App from './src/App';
import { name as appName } from './app.json';

/**
 * Enable MSW mocking in development when API_MOCK=true.
 * This intercepts all fetch requests and returns mock data.
 */
async function enableMocking() {
  // Only enable mocking in dev mode when explicitly configured
  if (!__DEV__ || Config.API_MOCK !== 'true') {
    return;
  }

  // Load polyfills required for MSW in React Native
  await import('./msw.polyfills');

  // Start the MSW server
  const { server } = await import('@repo/core/test/mocks/native');
  server.listen({ onUnhandledRequest: 'warn' });
}

enableMocking().then(() => {
  AppRegistry.registerComponent(appName, () => App);
});
