# Web Accounts (Remote MFE)

Accounts microfrontend that exposes account-related pages and components.

## Architecture

This is a **remote** in a Module Federation setup. It exposes an App component with internal routing that the shell (host) loads at runtime.

```
web-accounts (remote)
└── exposes ./App → consumed by web-shell at /accounts/*
```

### Routing Strategy

The shell mounts this microfrontend at `/accounts/*` with a wildcard route. This app handles its own internal routing:

- `/accounts` - Accounts list page
- `/accounts/:id` - Account details page
- `/accounts/:id/movements` - Account movements history

## Development

### Standalone Mode (Recommended for Development)

Run the accounts app independently with full hot reload:

```bash
pnpm dev
```

This starts a standard Vite dev server with HMR. Best for active development.

### Integration Testing

Run from the monorepo root to test with the shell:

```bash
pnpm preview:web
```

This builds web-accounts and serves the `remoteEntry.js` file that the shell needs.

> **Important:** This is for **integration testing only**. Preview mode has **no hot reload** - changes require rebuilding (restart the command).

### URLs

| Mode | URL | Description |
|------|-----|-------------|
| Integrated | http://localhost:3001 | Serves remoteEntry.js for shell |
| Standalone | http://localhost:3001 | Full standalone app |

## Module Federation Config

Components exposed to other microfrontends in `vite.config.ts`:

```typescript
federation({
  name: 'webAccounts',
  filename: 'remoteEntry.js',
  exposes: {
    './App': './src/App.tsx',
  },
  shared: ['react', 'react-dom', 'react-router-dom'],
})
```

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start dev server (standalone) |
| `pnpm preview:mfe` | Build + preview (for integrated mode) |
| `pnpm build` | Build for production |
| `pnpm preview` | Serve production build |
| `pnpm typecheck` | Run TypeScript checks |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run Playwright E2E tests |

## Important Notes

1. **Build Required for Integration**: The shell consumes `remoteEntry.js` which is only generated during build. Use `pnpm preview:mfe` or `pnpm build && pnpm preview` for integration testing.

2. **Shared Dependencies**: React, ReactDOM, and React Router are shared as singletons to avoid multiple instances.

3. **Internal Routing**: This microfrontend uses `Routes` (not `BrowserRouter`) since the shell provides the router context.

4. **Standalone Testing**: You can test components in isolation using `pnpm dev` without needing the shell.
