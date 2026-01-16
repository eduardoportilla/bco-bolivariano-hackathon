const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

// Monorepo root
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

/** @type {import('@react-native/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

module.exports = mergeConfig(config, {
  watchFolders: [monorepoRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
    unstable_enableSymlinks: true,
    unstable_enablePackageExports: true,
    disableHierarchicalLookup: true,
    blockList: [
      // Exclude Android CMake build directory to prevent Metro watcher crashes
      /android[/\\]app[/\\]\.cxx[/\\]/,
    ],
  },
});
