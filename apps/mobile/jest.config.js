/**
 * Jest configuration for React Native.
 *
 * Purpose:
 * - Make Jest understand React Native and modern JS syntax
 * - Prevent crashes caused by native-only libraries
 * - Provide a stable test environment for unit and component tests
 *
 * Modify this file ONLY when:
 * - A new native dependency breaks Jest
 * - A library ships untranspiled JS in node_modules
 * - Global test setup changes
 */
module.exports = {
  /**
   * React Native preset
   *
   * - Sets up the RN testing environment
   * - Enables Babel transforms for RN
   * - Resolves platform-specific files (.ios.js, .android.js)
   *
   * Required for any React Native project
   */
  preset: 'react-native',

  /**
   * Node modules that MUST be transformed by Babel
   *
   * By default, Jest ignores node_modules.
   * Many React Native libraries ship modern JS that Node cannot run.
   *
   * Add a package here ONLY if Jest throws syntax errors like:
   * "Unexpected token export"
   */
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-navigation|react-native-safe-area-context|react-native-screens)/)',
  ],

  /**
   * Map native-only libraries to manual mocks
   *
   * These libraries depend on iOS/Android native code
   * and will crash when executed in Jest (Node.js).
   *
   * Each entry redirects the import to a mock implementation
   * located in the __mocks__ folder.
   */
  moduleNameMapper: {
    '^@react-navigation/native$': '<rootDir>/__mocks__/@react-navigation/native.js',

    '^@react-navigation/native-stack$': '<rootDir>/__mocks__/@react-navigation/native-stack.js',

    '^react-native-safe-area-context$': '<rootDir>/__mocks__/react-native-safe-area-context.js',

    '^react-native-screens$': '<rootDir>/__mocks__/react-native-screens.js',
  },

  /**
   * Global test setup (runs AFTER Jest environment is ready)
   *
   * Used for:
   * - Extending Jest matchers
   * - Mocking globals (fetch, Animated, etc.)
   * - Silencing noisy warnings
   *
   * Do NOT put test logic here.
   */
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
