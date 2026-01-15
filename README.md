# Banco Bolivariano Digital Banking

Monorepo for the Banco Bolivariano hackathon - Web and Mobile digital banking applications.

---

## Requirements

- Node.js >= 22
- pnpm 10.x
- For mobile: Android Studio / Xcode

---

## Setup

```bash
# Clone the repository
git clone <repo-url>
# Recommended: rename the repository to bbh for reduce path length (avoid errors during Android build in Windows)
cd bbh

# Install dependencies
pnpm install

# Install Playwright browsers (for E2E tests in web apps)
pnpm exec playwright install
```

---

## Development

### Web Microfrontends (Standalone Development)

For active development with hot reload, run each microfrontend independently:

```bash
# Shell only (without auth integration)
pnpm dev --filter web-shell

# Auth only (standalone login page)
pnpm dev --filter web-auth
```

This is the recommended approach for day-to-day development. Each app has full HMR support.

### Web Microfrontends (Integration Testing)

To test both microfrontends integrated (shell + auth):

```bash
pnpm preview:web
```

This builds `web-auth` and serves it in preview mode, then runs `web-shell` in dev mode.

- Shell: http://localhost:3000 (dev mode with HMR)
- Auth remote: http://localhost:3001 (preview mode, **no HMR**)

> **Important:** This is for **integration testing only**, not active development. Changes to web-auth require rebuilding (restart the command). Use standalone mode for development with hot reload.

> **Why preview?** Module Federation requires remotes to be built. The `remoteEntry.js` file is only generated during build, not in pure dev mode.

### Mobile

```bash
cd apps/mobile

# Start Metro bundler
pnpm start

# Android (in separate terminal)
pnpm android

# iOS (macOS only)
pnpm ios
```

### All Apps

```bash
pnpm dev
```

---

## Build

```bash
# Build all packages and apps
pnpm build

# Build specific app
pnpm build --filter web-shell
```

---

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development (with HMR) |
| `pnpm preview:web` | Test web MFEs integrated (no HMR for remotes) |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | Lint all code |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm test` | Run tests |
| `pnpm clean` | Remove node_modules and build artifacts |

---

## Project Structure

```
bbh/
├── apps/
│   ├── web-shell/      # Host microfrontend
│   ├── web-auth/       # Authentication microfrontend
│   └── mobile/         # React Native app
├── packages/
│   ├── core/           # Shared business logic (@repo/core)
│   └── ui-web/         # Web design system (@repo/ui)
├── docs/
│   └── guidelines/     # Development guidelines
└── scripts/            # Build utilities
```

---

## Tech Stack

**Web:**
- React 19
- TypeScript
- Vite + Module Federation
- TailwindCSS 4.1
- shadcn/ui

**Mobile:**
- React Native CLI
- TypeScript
- React Navigation

**Shared:**
- pnpm workspaces
- Turborepo
- Zustand
- React Query

---

## Documentation

- [AI Agent Guidelines](AGENTS.md) - For AI coding assistants
- [Framework Guide](docs/agents/FRAMEWORK.md) - Development methodology
