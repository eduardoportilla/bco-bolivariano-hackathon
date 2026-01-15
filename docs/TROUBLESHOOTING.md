# Troubleshooting

## Common Issues

### "Path too long" / `ninja: error: mkdir(...)`

**Issue:** Build fails on Windows with path length errors.

**Solution:** Move project to a shorter path like `C:\Dev\bbh` or `C:\Projects\rn\bbh`.

---

## Clean Script

Reset the project to a clean state when experiencing build issues.

```bash
pnpm clean
```

**What it removes:**
- `node_modules`, `dist`, `build`, `coverage`
- `.turbo`, `.gradle`, `.kotlin`, `Pods`
- Platform caches (`.expo`, `.next`, `.dart_tool`)

**When to use:**
- Inexplicable build errors
- After moving/renaming project
- Dependency issues
- Before major releases

**Recovery after clean:**

```bash
pnpm install
cd apps/mobile/ios && pod install && cd ../../..
pnpm dev
```

---

## Native Rebuild (Mobile)

Rebuild nativo necesario despues de instalar librerias con codigo nativo (ej: react-native-reanimated).

### Android

```bash
cd apps/mobile/android
./gradlew clean        # macOS/Linux
.\gradlew.bat clean    # Windows
cd ..
pnpm android
```

### iOS (macOS only)

```bash
cd apps/mobile/ios
pod install
cd ..
pnpm ios
```

### Full Clean + Rebuild

```bash
cd apps/mobile

# Android
cd android && ./gradlew clean && cd ..
pnpm android

# iOS
cd ios && pod deintegrate && pod install && cd ..
pnpm ios
```

**Cuando hacer rebuild:**
- Despues de `pnpm add <libreria-nativa>`
- Despues de actualizar version de libreria nativa
- Error "Native module not found"

---

## Web Microfrontends

### React Compiler + Module Federation Incompatibility

**Issue:** When using React Compiler (`babel-plugin-react-compiler`) with Module Federation, remote components fail with:

```
TypeError: Cannot read properties of null (reading 'useMemoCache')
```

**Cause:** React Compiler generates code that uses internal React APIs (`useMemoCache`). When components are loaded via Module Federation, even with `singleton: true` sharing, the React internals aren't properly unified between host and remote.

**Solution:** Do not use React Compiler in microfrontend apps. The performance benefits don't outweigh the compatibility issues with Module Federation.

```typescript
// vite.config.ts - Use simple react() without compiler
react(),

// NOT this:
react({
  babel: {
    plugins: [['babel-plugin-react-compiler']],
  },
}),
```

**Status:** This is a known limitation. Future versions of React Compiler or Module Federation plugins may resolve this.
