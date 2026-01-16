/**
 * Monorepo Reset Script
 *
 * Clears all caches and build artifacts to restore a clean state.
 * Useful for fixing cache corruption, Reanimated/Worklets issues, or broken builds.
 *
 * Usage:
 *   pnpm reset              Full reset: clean + reinstall dependencies
 *   pnpm reset --no-install Clean only: remove artifacts without reinstalling
 *   pnpm clean              Alias for: pnpm reset --no-install
 *
 * What it clears:
 *   - node_modules, .turbo, dist, build, .gradle, .kotlin
 *   - Metro and Haste caches (temp directory)
 *   - Watchman cache
 *   - macOS only: Pods, Podfile.lock, Xcode DerivedData
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');
const os = require('os');

// Parse arguments
const args = process.argv.slice(2);
const skipInstall = args.includes('--no-install') || args.includes('--skip-install');

const rootDir = path.resolve(__dirname, '..');
const mobileDir = path.resolve(rootDir, 'apps', 'mobile');
const isMac = process.platform === 'darwin';
const isWindows = process.platform === 'win32';

// Directories to remove (cross-platform)
const dirsToRemove = [
  'node_modules',
  '.turbo',
  'dist',
  'build',
  '.gradle',
  '.kotlin',
  '.expo',
  '.next',
  'coverage',
  '.docusaurus',
];

// iOS-specific directories (macOS only)
const iosDirsToRemove = [
  'Pods',
];

// Files to remove
const filesToRemove = [
  '.DS_Store',
  'Podfile.lock',
];

// Get Metro cache directory based on platform
function getMetroCacheDir() {
  if (isWindows) {
    return path.join(os.tmpdir(), 'metro-cache');
  }
  // macOS/Linux: $TMPDIR or /tmp
  const tmpDir = process.env.TMPDIR || '/tmp';
  return tmpDir;
}

// Get Haste map directory
function getHasteMapDir() {
  if (isWindows) {
    return path.join(os.tmpdir(), 'haste-map');
  }
  const tmpDir = process.env.TMPDIR || '/tmp';
  return tmpDir;
}

// Execute command safely
function execSafe(command, options = {}) {
  try {
    console.log(`  Running: ${command}`);
    execSync(command, { stdio: 'inherit', ...options });
    return true;
  } catch (error) {
    console.log(`  Warning: Command failed (${error.message})`);
    return false;
  }
}

// Check if command exists
function commandExists(cmd) {
  try {
    const result = spawnSync(isWindows ? 'where' : 'which', [cmd], { stdio: 'pipe' });
    return result.status === 0;
  } catch {
    return false;
  }
}

// Remove directory safely
function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    console.log(`  Removing: ${dirPath}`);
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
    } catch (error) {
      console.log(`  Warning: Could not remove ${dirPath} (${error.message})`);
    }
  }
}

// Remove file safely
function removeFile(filePath) {
  if (fs.existsSync(filePath)) {
    console.log(`  Removing: ${filePath}`);
    try {
      fs.rmSync(filePath, { force: true });
    } catch (error) {
      console.log(`  Warning: Could not remove ${filePath} (${error.message})`);
    }
  }
}

// Recursively find and remove directories/files
function cleanDirectory(dir, targetDirs, targetFiles, skipDirs = ['.git']) {
  if (skipDirs.some(skip => dir.includes(skip))) return;

  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (targetDirs.includes(entry.name)) {
        removeDir(fullPath);
      } else if (!skipDirs.includes(entry.name)) {
        cleanDirectory(fullPath, targetDirs, targetFiles, skipDirs);
      }
    } else if (entry.isFile() && targetFiles.includes(entry.name)) {
      removeFile(fullPath);
    }
  }
}

// Clear Metro and Haste caches
function clearMetroCache() {
  console.log('\n[3/6] Clearing Metro cache...');

  const tmpDir = getMetroCacheDir();

  if (isWindows) {
    // Windows: clear metro-cache directory
    const metroCachePath = path.join(os.tmpdir(), 'metro-cache');
    removeDir(metroCachePath);

    // Also check for haste-map
    const hasteMapPath = path.join(os.tmpdir(), 'haste-map-react-native-packager');
    removeDir(hasteMapPath);
  } else {
    // macOS/Linux: find and remove metro-* and haste-map-* directories
    try {
      const tmpEntries = fs.readdirSync(tmpDir);
      for (const entry of tmpEntries) {
        if (entry.startsWith('metro-') || entry.startsWith('haste-map-')) {
          removeDir(path.join(tmpDir, entry));
        }
      }
    } catch (error) {
      console.log(`  Warning: Could not clean temp directory (${error.message})`);
    }
  }
}

// Clear Watchman cache (cross-platform, but more common on macOS)
function clearWatchman() {
  console.log('\n[4/6] Clearing Watchman cache...');

  if (commandExists('watchman')) {
    execSafe('watchman watch-del-all');
  } else {
    console.log('  Watchman not installed, skipping...');
  }
}

// Clear Xcode DerivedData (macOS only)
function clearXcodeDerivedData() {
  if (!isMac) return;

  console.log('\n[5/6] Clearing Xcode DerivedData...');
  const derivedDataPath = path.join(os.homedir(), 'Library', 'Developer', 'Xcode', 'DerivedData');
  removeDir(derivedDataPath);
}

// Reinstall dependencies
function reinstallDependencies() {
  if (skipInstall) {
    console.log('\n[6/6] Skipping dependency installation (--no-install)');
    return;
  }

  console.log('\n[6/6] Reinstalling dependencies...');

  // Install pnpm dependencies
  console.log('  Installing pnpm dependencies...');
  execSafe('pnpm install', { cwd: rootDir });

  // Install CocoaPods (macOS only)
  if (isMac) {
    const iosDir = path.join(mobileDir, 'ios');
    if (fs.existsSync(iosDir)) {
      console.log('  Installing CocoaPods...');
      execSafe('pod install --repo-update', { cwd: iosDir });
    }
  }
}

// Main reset function
function reset() {
  const mode = skipInstall ? 'CLEAN (no reinstall)' : 'FULL RESET';

  console.log('='.repeat(60));
  console.log(`  MONOREPO ${mode}`);
  console.log(`  Platform: ${process.platform}`);
  console.log(`  Root: ${rootDir}`);
  console.log('='.repeat(60));

  // Step 1: Clear Watchman first (before removing node_modules)
  clearWatchman();

  // Step 2: Remove build artifacts and node_modules
  console.log('\n[1/6] Removing build artifacts and node_modules...');
  const allDirs = isMac ? [...dirsToRemove, ...iosDirsToRemove] : dirsToRemove;
  const allFiles = isMac ? filesToRemove : filesToRemove.filter(f => f !== 'Podfile.lock');
  cleanDirectory(rootDir, allDirs, allFiles);

  // Step 3: Clear Android .cxx directories (both platforms)
  console.log('\n[2/6] Clearing Android native cache...');
  const androidCxxPath = path.join(mobileDir, 'android', 'app', '.cxx');
  removeDir(androidCxxPath);

  // Step 4: Clear Metro cache
  clearMetroCache();

  // Step 5: Clear Xcode DerivedData (macOS only)
  clearXcodeDerivedData();

  // Step 6: Reinstall dependencies
  reinstallDependencies();

  console.log('\n' + '='.repeat(60));
  console.log(skipInstall ? '  CLEAN COMPLETE!' : '  RESET COMPLETE!');
  console.log('='.repeat(60));

  if (skipInstall) {
    console.log('\nNext steps:');
    console.log('  pnpm install');
    if (isMac) {
      console.log('  cd apps/mobile/ios && pod install');
    }
  } else {
    console.log('\nNext steps:');
    if (isMac) {
      console.log('  cd apps/mobile && pnpm ios');
    } else if (isWindows) {
      console.log('  cd apps/mobile && pnpm android');
    }
  }
}

// Run
reset();
