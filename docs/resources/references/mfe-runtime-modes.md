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
enableMocking().then(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>
  );
});
```

### basename and BASE_URL

The `basename` prop uses `import.meta.env.BASE_URL`, a **built-in Vite variable** (no `VITE_` prefix needed) that mirrors the `base` value from `vite.config.ts`:

| Scenario | `base` in vite.config.ts | `BASE_URL` | Routes handled |
|----------|--------------------------|------------|----------------|
| Default (dev) | `/` | `/` | `/`, `/:id`, etc. |
| Same-host deploy | `/_mfe/accounts/` | `/_mfe/accounts/` | `/_mfe/accounts/`, `/_mfe/accounts/:id`, etc. |

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

## Common Pitfall: Missing `basename`

If the MFE is deployed to a subpath (e.g., `/_mfe/accounts/`) without setting `basename` on the standalone `BrowserRouter`, React Router will fail to match routes:

```
No routes matched location "/_mfe/accounts"
```

Fix: Use `import.meta.env.BASE_URL` as the `basename`:

```typescript
<BrowserRouter basename={import.meta.env.BASE_URL}>
```

---

## Checklist

- [ ] `App.tsx` uses `<Routes>` only (no `BrowserRouter`)
- [ ] `main.tsx` wraps `<App />` in `<BrowserRouter basename={import.meta.env.BASE_URL}>`
- [ ] Federation config exposes `App.tsx`, not `main.tsx`
- [ ] Shell mounts remote with wildcard path (e.g., `path="/accounts/*"`)

---

## See Also

- [Microfrontend Environment Variables](./mfe-env-vars.md) - Build-time configuration
- [Microfrontend Deployment](./mfe-deployment.md) - Server and SPA fallback rules
