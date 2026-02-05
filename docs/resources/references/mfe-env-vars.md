# Microfrontend Environment Variables

Standard for configuring remote microfrontend URLs and base paths in web applications.

## Overview

The shell application needs to know where to load each remote microfrontend from. Each remote may also need a custom base path when deployed on the same host (instead of a separate domain/port).

## Environment Variables

### Shell (Host) Configuration

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `REMOTE_WEB_{NAME}_URL` | Base URL of the remote microfrontend | `http://localhost:{port}` | `https://accounts.example.com` |

The shell uses these URLs to construct the `remoteEntry.js` path:

```typescript
// apps/web-shell/vite.config.ts
remotes: {
  webAccounts: `${process.env.REMOTE_WEB_ACCOUNTS_URL || 'http://localhost:3001'}/assets/remoteEntry.js`,
}
```

### Remote (Microfrontend) Configuration

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `REMOTE_WEB_{NAME}_BASE_PATH` | Base path when deployed on same host | `/` | `/accounts/` |

Each remote uses its base path in the Vite configuration:

```typescript
// apps/web-accounts/vite.config.ts
base: process.env.REMOTE_WEB_ACCOUNTS_BASE_PATH || '/',
```

## Naming Convention

- **Pattern:** `REMOTE_WEB_{NAME}_URL` and `REMOTE_WEB_{NAME}_BASE_PATH`
- **{NAME}:** Uppercase version of the remote's module name (e.g., `ACCOUNTS` for `webAccounts`)

| Remote Module | URL Variable | Base Path Variable | Same Host Path |
|---------------|--------------|-------------------|----------------|
| `webAccounts` | `REMOTE_WEB_ACCOUNTS_URL` | `REMOTE_WEB_ACCOUNTS_BASE_PATH` | `/_mfe/accounts/` |
| `webTransfers` | `REMOTE_WEB_TRANSFERS_URL` | `REMOTE_WEB_TRANSFERS_BASE_PATH` | `/_mfe/transfers/` |
| `webCards` | `REMOTE_WEB_CARDS_URL` | `REMOTE_WEB_CARDS_BASE_PATH` | `/_mfe/cards/` |

## Deployment Scenarios

### Scenario 1: Separate Hosts (Development / Isolated Deployment)

Each microfrontend runs on its own domain or port.

```bash
# Shell .env
REMOTE_WEB_ACCOUNTS_URL=https://web-accounts.example.com

# Remote .env (web-accounts)
REMOTE_WEB_ACCOUNTS_BASE_PATH=/  # "/" is already the default value, so it can be omitted
```

Assets are served from root:
- `https://web-accounts.example.com/assets/remoteEntry.js`
- `https://web-accounts.example.com/assets/index.js`

### Scenario 2: Same Host with Subpaths (Production)

All microfrontends are served from the same domain under the `/_mfe/` prefix.

```bash
# Shell .env
REMOTE_WEB_ACCOUNTS_URL=https://app.example.com/_mfe/accounts

# Remote .env (web-accounts)
REMOTE_WEB_ACCOUNTS_BASE_PATH=/_mfe/accounts/
```

Assets are served from the subpath:
- `https://app.example.com/_mfe/accounts/assets/remoteEntry.js`
- `https://app.example.com/_mfe/accounts/assets/index.js`

> **Convention:** Use `/_mfe/{name}/` prefix to clearly separate microfrontend assets from shell routes.

## Implementation

### Shell (vite.config.ts)

```typescript
federation({
  name: 'shell',
  remotes: {
    webAccounts: `${process.env.REMOTE_WEB_ACCOUNTS_URL || 'http://localhost:3001'}/assets/remoteEntry.js`,
    // Add more remotes following the same pattern:
    // webTransfers: `${process.env.REMOTE_WEB_TRANSFERS_URL || 'http://localhost:3002'}/assets/remoteEntry.js`,
  },
  shared: { /* ... */ },
})
```

### Remote (vite.config.ts)

```typescript
export default defineConfig({
  base: process.env.REMOTE_WEB_ACCOUNTS_BASE_PATH || '/', // Always include trailing slash
  plugins: [
    federation({
      name: 'webAccounts',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
      },
      shared: { /* ... */ },
    }),
  ],
});
```

## Important Notes

1. **Trailing Slash:** Always include a trailing slash in `BASE_PATH` (e.g., `/accounts/` not `/accounts`)
2. **No VITE_ Prefix:** These variables are used at build time in `vite.config.ts`, not runtime, so they don't need the `VITE_` prefix
3. **Default Values:** Always provide sensible defaults for local development
4. **Shell Only Uses URLs:** The shell doesn't need `BASE_PATH` variables, only the remotes do
5. **Remotes Don't Use URLs:** The remotes don't need the URL variables, only the shell does

---

## See Also

- [Microfrontend Deployment](./mfe-deployment.md) - Server configuration and SPA fallback rules
