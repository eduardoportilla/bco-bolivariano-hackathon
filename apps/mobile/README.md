# BBH Mobile App

React Native mobile application for Banco Bolivariano.

## Prerequisites

- Node.js >= 22
- pnpm (installed via corepack)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

See [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment) for detailed setup instructions.

## Development

### Start Metro bundler

```bash
pnpm start
```

### Run on device/emulator

```bash
# Android
pnpm android

# iOS (macOS only)
pnpm ios
```

## Troubleshooting

### Build issues or cache problems

From the monorepo root, run:

```bash
pnpm reset
```

This clears all caches (Metro, Watchman, Pods, DerivedData) and reinstalls dependencies.

### Native rebuild

After installing native libraries (e.g., react-native-reanimated):

```bash
# Android
cd android && ./gradlew clean && cd ..
pnpm android

# iOS
cd ios && pod install && cd ..
pnpm ios
```

### Path too long (Windows)

Move project to a shorter path like `C:\Dev\bbh`.

## Project Structure

```
src/
├── app/           # App entry, providers, navigation
├── features/      # Feature modules (auth, dashboard, etc.)
├── shared/        # Shared components, hooks, utils
└── assets/        # Images, fonts
```

## More Information

- [Monorepo README](../../README.md)
- [Mobile Guidelines](../../docs/guidelines/mobile.md)
- [Troubleshooting](../../docs/TROUBLESHOOTING.md)
