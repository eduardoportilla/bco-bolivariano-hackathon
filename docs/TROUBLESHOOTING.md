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
