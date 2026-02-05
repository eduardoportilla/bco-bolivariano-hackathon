# Microfrontend Runtime Modes

Each remote microfrontend can run in two modes: **Standalone** and **Federated (Module Federation)**. Understanding the difference is critical for routing, debugging, and deployment.

## Overview

| Aspect | Standalone Mode | Federated Mode |
|--------|----------------|----------------|
| Entry point | `main.tsx` | `App.tsx` (via `remoteEntry.js`) |
| Router | MFE's own `BrowserRouter` | Shell's `BrowserRouter` |
| Use case | Local dev, isolated testing | Production, integrated |
| `main.tsx` executed? | Yes | **No** |

---

## Standalone Mode

Used during local development and isolated testing. The MFE runs as a full SPA with its own router.

### Entry Flow

```
main.tsx -> BrowserRouter (with basename) -> App.tsx -> Routes
```

### How It Works

`main.tsx` bootstraps the full application with its own `BrowserRouter`:

```typescript
// apps/web-accounts/src/main.tsx
import { getRouterBasename } from '@repo/core/shared/utils';

enableMocking().then(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter basename={getRouterBasename(import.meta.env.BASE_URL)}>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>
  );
});
```

### basename and BASE_URL

`import.meta.env.BASE_URL` is a **built-in Vite variable** (no `VITE_` prefix needed) that mirrors the `base` value from `vite.config.ts`. However, Vite always includes a trailing slash while React Router expects no trailing slash:

| Source | Format | Example |
|--------|--------|---------|
| Vite `BASE_URL` | With trailing slash | `/_mfe/accounts/` |
| React Router `basename` | No trailing slash | `/_mfe/accounts` |

The `getRouterBasename()` utility from `@repo/core/shared/utils` handles this conversion, including empty or undefined values.

---

## Federated Mode (Module Federation)

Used in production when the shell loads the MFE as a remote. Only the exposed module (`App.tsx`) is loaded, **`main.tsx` is never executed**.

### Entry Flow

```
Shell's BrowserRouter -> Route path="/accounts/*" -> App.tsx -> Routes
```

### How It Works

The federation config only exposes `App.tsx` (not `main.tsx`). When the shell imports `webAccounts/App`, it gets the `App` component directly -- the shell's `BrowserRouter` provides the router context, and the wildcard `/*` in the shell's route allows the remote to handle its own sub-routes.

Key rules for `App.tsx`:
- Use only `<Routes>`, **never** `<BrowserRouter>`
- Route paths are relative (e.g., `:id`, not `/accounts/:id`)

> See `docs/guidelines/architecture.md` > Microfrontends for full Shell, Remote, and Loading Remotes config examples.

---

## Common Pitfall: Missing or Incorrect `basename`

If the MFE is deployed to a subpath (e.g., `/_mfe/accounts/`) without setting `basename`, or using `BASE_URL` directly (which has a trailing slash), React Router will fail:

```
No routes matched location "/_mfe/accounts"
```

Fix: Use `getRouterBasename()` to normalize `BASE_URL`:

```typescript
import { getRouterBasename } from '@repo/core/shared/utils';

<BrowserRouter basename={getRouterBasename(import.meta.env.BASE_URL)}>
```

---

## Checklist

- [ ] `App.tsx` uses `<Routes>` only (no `BrowserRouter`)
- [ ] `main.tsx` uses `getRouterBasename(import.meta.env.BASE_URL)` for the `basename` prop
- [ ] Federation config exposes `App.tsx`, not `main.tsx`
- [ ] Shell mounts remote with wildcard path (e.g., `path="/accounts/*"`)

---

## See Also

- [Microfrontend Environment Variables](./mfe-env-vars.md) - Build-time configuration
- [Microfrontend Deployment](./mfe-deployment.md) - Server and SPA fallback rules
