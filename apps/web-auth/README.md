# Web Auth (Remote MFE)

Authentication microfrontend that exposes login and auth-related components.

## Architecture

This is a **remote** in a Module Federation setup. It exposes components that the shell (host) can load at runtime.

```
web-auth (remote)
└── exposes ./LoginPage → consumed by web-shell
```

## Development

### Standalone Mode (Recommended for Development)

Run the auth app independently with full hot reload:

```bash
pnpm dev
```

This starts a standard Vite dev server with HMR. Best for active development.

### Integration Testing

Run from the monorepo root to test with the shell:

```bash
pnpm preview:web
```

This builds web-auth and serves the `remoteEntry.js` file that the shell needs.

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
  name: 'webAuth',
  filename: 'remoteEntry.js',
  exposes: {
    './LoginPage': './src/pages/LoginPage.tsx',
  },
  shared: ['react', 'react-dom', 'react-router-dom'],
})
```

## Exposing New Components

1. Create the component in `src/pages/` or `src/components/`

2. Add to exposes in `vite.config.ts`:

```typescript
exposes: {
  './LoginPage': './src/pages/LoginPage.tsx',
  './ForgotPasswordPage': './src/pages/ForgotPasswordPage.tsx', // new
},
```

3. Rebuild (`pnpm build`) for changes to be available to the shell

4. Add type declaration in the shell's `src/remotes.d.ts`

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

3. **Standalone Testing**: You can test components in isolation using `pnpm dev` without needing the shell.
