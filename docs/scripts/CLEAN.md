# Clean Script Utility

This utility script allows you to deeply clean the project by removing generated directories and artifacts. It is useful for resolving build errors caused by stale caches, corrupt `node_modules`, or when moving the project to a new location.

## Usage

You can run the clean script from the root of the project using `pnpm`.

```bash
pnpm clean
```

## What it does

The script recursively traverses the project (skipping `.git`) and deletes the following directories:

- `node_modules`: Clears all installed dependencies.
- `.gradle`: Clears Gradle caches (Android).
- `.kotlin`: Clears Kotlin caches.
- `build`: Clears build outputs.
- `dist`: Clears distribution builds.
- `.turbo`: Clears TurboRepo caches.
- `.expo`: Clears Expo caches.
- `.next`: Clears Next.js build artifacts.
- `coverage`: Clears test coverage reports.
- `Pods`: Clears iOS CocoaPods dependencies.
- `.dart_tool`: Clears Dart/Flutter tools (if applicable).

And the following files:
- `.DS_Store`: MacOS system files.

## When to use it

1.  **Build Failures**: If you encounter inexplicable build errors (e.g., "duplicate resources", "class not found", "configuration not allowed").
2.  **After Moving Project**: If you move or rename the project folder (absolute paths in caches will be broken).
3.  **Dependency Issues**: If `pnpm install` or `pnpm add` acts unexpectedly.
4.  **Fresh Start**: When you want to ensure a completely clean state before a release or major refactor.

## Recovery

After running `pnpm clean`, you **must** reinstall dependencies and potentially other platform-specific setups:

```bash
# 1. Reinstall Node dependencies
pnpm install

# 2. (iOS only) Reinstall Pods
cd apps/mobile/ios && pod install && cd ../../..

# 3. Rebuild your app
pnpm run android 
# or 
pnpm run ios
```
