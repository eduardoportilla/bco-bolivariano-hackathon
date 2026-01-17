/** @type {import('react-native-worklets/plugin').PluginOptions} */
const workletsPluginOptions = {
  relativeSourceLocation: true,
}

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Required for "export * as namespace" syntax (eg. zod v4)
    '@babel/plugin-transform-export-namespace-from',
    ['react-native-worklets/plugin', workletsPluginOptions],
  ],
};
