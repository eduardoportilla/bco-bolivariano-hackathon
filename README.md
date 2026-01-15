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

### All Apps

```bash
pnpm dev
```

### Web Only

```bash
pnpm dev --filter web-shell
pnpm dev --filter web-auth
```

### Mobile

```bash
cd apps/mobile

# Android
pnpm android

# iOS (macOS only)
pnpm ios
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
| `pnpm dev` | Start all apps in development |
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
