const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const dirsToRemove = [
  'node_modules',
  '.gradle',
  '.kotlin',
  'build',
  'dist',
  '.turbo',
  '.expo',
  '.next',
  'coverage',
  '.docusaurus',
  'Pods', // React Native iOS dependencies
  '.dart_tool' // Flutter/Dart if applicable, just in case
];

// Files to optionally remove (e.g., .DS_Store)
const filesToRemove = [
  '.DS_Store'
];

function clean(dir) {
  // Avoid entering .git
  if (path.basename(dir) === '.git') return;

  let startPaths;
  try {
    startPaths = fs.readdirSync(dir);
  } catch (err) {
    // If we can't read the directory (e.g. permission issues), skip it
    return;
  }

  for (const item of startPaths) {
    const fullPath = path.join(dir, item);
    let stats;
    try {
      stats = fs.lstatSync(fullPath);
    } catch (err) {
      continue;
    }

    if (stats.isDirectory()) {
      if (dirsToRemove.includes(item)) {
        console.log(`Deleting directory: ${fullPath}`);
        try {
          fs.rmSync(fullPath, { recursive: true, force: true });
        } catch (err) {
          console.error(`Error deleting ${fullPath}:`, err.message);
        }
      } else {
        // Recurse into subdirectories
        clean(fullPath);
      }
    } else if (stats.isFile()) {
      if (filesToRemove.includes(item)) {
        console.log(`Deleting file: ${fullPath}`);
        try {
          fs.rmSync(fullPath, { force: true });
        } catch (err) {
          console.error(`Error deleting ${fullPath}:`, err.message);
        }
      }
    }
  }
}

console.log(`Starting clean up from root: ${rootDir}`);
console.log(`Target directories: ${dirsToRemove.join(', ')}`);
clean(rootDir);
console.log('Clean complete!');
