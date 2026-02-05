# Troubleshooting

## Common Issues

### "Path too long" / `ninja: error: mkdir(...)`

**Issue:** Build fails on Windows with path length errors.

**Solution:** Move project to a shorter path like `C:\Dev\bbh` or `C:\Projects\rn\bbh`.

---

## Reset Script

Full project reset when experiencing build issues (especially cache-related problems like Reanimated worklets).

```bash
pnpm reset
```

**What it does (cross-platform):**
- Clears Watchman cache
- Removes `node_modules`, `dist`, `build`, `.turbo`, `.gradle`, `.kotlin`
- Clears Metro and Haste caches
- **macOS only:** Removes `Pods`, `Podfile.lock`, Xcode DerivedData
- Reinstalls all dependencies (`pnpm install`)
- **macOS only:** Runs `pod install --repo-update`

**When to use:**
- Inexplicable build errors
- Cache corruption (especially after switching branches or pulling changes)
- Native module issues (Reanimated, Worklets, etc.)
- After moving/renaming project

**Quick clean (no reinstall):**

```bash
pnpm clean                  # Alias for: pnpm reset --no-install
pnpm reset --no-install     # Explicit flag
```

Use `clean` for fast artifact removal without reinstalling dependencies. Both commands use the same script.

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

### Full Reset + Rebuild

For persistent issues, run a full reset from the monorepo root:

```bash
# From monorepo root
pnpm reset

# Then rebuild
cd apps/mobile
pnpm android  # or pnpm ios
```

**Cuando hacer rebuild:**
- Despues de `pnpm add <libreria-nativa>`
- Despues de actualizar version de libreria nativa
- Error "Native module not found"

---

## Web Microfrontends

### Shared Dependencies Mismatch

**Issue:** Remote MFE crashes with errors like:
- `Invalid hook call` or hooks not working across host/remote boundary
- `Cannot read properties of null` on React internals
- Multiple instances of React detected
- React Query context `undefined` in remote components

**Cause:** The `shared` config in `vite.config.ts` is out of sync between shell and remote(s). If a dependency is missing `singleton: true` or is listed in one config but not the other, Module Federation loads separate instances.

**Solution:** Ensure the `shared` block is **identical** in shell and all remotes. See `docs/guidelines/architecture.md` > Shared Dependencies for the correct config and rules.

---

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
