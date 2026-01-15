# Web Shell (Host MFE)

The main container application that orchestrates all web microfrontends.

## Architecture

This is the **host** in a Module Federation setup. It loads remote modules from other microfrontends at runtime.

```
web-shell (host)
└── loads webAuth/LoginPage from web-auth (remote)
```

## Development

### Standalone Mode (Recommended for Development)

Run the shell independently with full hot reload:

```bash
pnpm dev
```

> **Note:** In standalone mode, navigating to `/login` will show a "Service unavailable" message since the auth remote isn't running. This is expected during shell-only development.

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
    webAuth: 'http://localhost:3001/assets/remoteEntry.js',
  },
  shared: ['react', 'react-dom', 'react-router-dom'],
})
```

## Loading Remote Components

```typescript
// Lazy load remote component
const RemoteLogin = lazy(() => import('webAuth/LoginPage'));

// Use with Suspense and ErrorBoundary
<ErrorBoundary fallback={<RemoteUnavailable />}>
  <Suspense fallback={<Loading />}>
    <RemoteLogin />
  </Suspense>
</ErrorBoundary>
```

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
  webAuth: 'http://localhost:3001/assets/remoteEntry.js',
  webAccounts: 'http://localhost:3002/assets/remoteEntry.js', // new
},
```

2. Add type declaration in `src/remotes.d.ts`:

```typescript
declare module 'webAccounts/DashboardPage' {
  const DashboardPage: React.ComponentType;
  export default DashboardPage;
}
```

3. Import and use with lazy loading.
