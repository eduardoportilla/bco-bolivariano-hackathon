# Web Shell (Host MFE)

The main container application that orchestrates all web microfrontends and owns authentication routes.

## Architecture

This is the **host** in a Module Federation setup. It loads remote modules from other microfrontends at runtime.

```
web-shell (host)
├── owns auth routes (/login, /forgot-password, /reset-password)
└── loads webAccounts/App from web-accounts at /accounts/*
```

### Routing Strategy (Hybrid Approach)

- **Shell owns:** Top-level routing, auth routes (cross-cutting concern), browser history
- **Microfrontends own:** Internal routing within their domain prefix

Auth is not a separate microfrontend because it's infrastructure, not a business domain.

## Development

### Standalone Mode (Recommended for Development)

Run the shell independently with full hot reload:

```bash
pnpm dev
```

> **Note:** In standalone mode, navigating to `/accounts` will show a "Service unavailable" message since the accounts remote isn't running. Auth routes work in standalone mode.

### Integration Testing

Run from the monorepo root to test with remotes:

```bash
pnpm preview:web
```

> **Important:** This is for **integration testing only**. The shell has HMR, but remote changes require rebuilding (restart the command). Use standalone mode for active development.

### URLs

| Mode | URL | Description |
|------|-----|-------------|
| Integrated | http://localhost:3000 | Full app with remotes |
| Standalone | http://localhost:3000 | Shell only, remotes unavailable |

## Module Federation Config

The shell loads remotes defined in `vite.config.ts`:

```typescript
federation({
  name: 'shell',
  remotes: {
    webAccounts: 'http://localhost:3001/assets/remoteEntry.js',
  },
  shared: ['react', 'react-dom', 'react-router-dom'],
})
```

## Loading Remote Microfrontends

```typescript
// Lazy load remote microfrontend
const AccountsApp = lazy(() => import('webAccounts/App'));

// Use with Suspense and ErrorBoundary
<Route
  path="/accounts/*"
  element={
    <RemoteErrorBoundary fallback={<RemoteUnavailable name="Cuentas" />}>
      <Suspense fallback={<Loading />}>
        <AccountsApp />
      </Suspense>
    </RemoteErrorBoundary>
  }
/>
```

The `/*` wildcard allows the microfrontend to handle its own internal routes.

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start dev server (standalone) |
| `pnpm preview:mfe` | Start dev server (for integrated mode) |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm typecheck` | Run TypeScript checks |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run Playwright E2E tests |

## Adding New Remotes

1. Add the remote URL in `vite.config.ts`:

```typescript
remotes: {
  webAccounts: 'http://localhost:3001/assets/remoteEntry.js',
  webTransfers: 'http://localhost:3002/assets/remoteEntry.js', // new
},
```

2. Add type declaration in `src/remotes.d.ts`:

```typescript
declare module 'webTransfers/App' {
  const App: React.ComponentType;
  export default App;
}
```

3. Add route with wildcard and lazy loading in `App.tsx`.
