const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = getDefaultConfig(projectRoot);

module.exports = mergeConfig(config, {
  watchFolders: [workspaceRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules'),
    ],
    blockList: [
      // Exclude android build directory to prevent Metro watcher crashes
      /[/\\]android[/\\]app[/\\]\.cxx[/\\]/,
    ].concat(config.resolver.blockList),
  },
});
