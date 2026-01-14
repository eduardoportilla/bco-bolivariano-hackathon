# Architecture Guidelines

## Monorepo Structure

```
bbh/
├── apps/
│   ├── web-shell/         # Host MFE (container)
│   ├── web-auth/          # Auth MFE (remote)
│   └── mobile/            # React Native app
├── packages/
│   ├── ui-web/            # Web design system
│   ├── ui-mobile/         # Mobile components
│   ├── typescript-config/ # Shared TS configs
│   └── eslint-config/     # Shared ESLint configs
├── docs/
│   └── agents/            # AI development framework
└── scripts/               # Build and utility scripts
```

---

## Feature-Based Organization

Organize application code by **feature/domain**, not by file type.

### Web App Structure

```
apps/web-auth/src/
├── features/                    # Feature modules (domain-driven)
│   ├── login/
│   │   ├── components/          # Feature-specific components
│   │   │   ├── LoginForm.tsx
│   │   │   └── BiometricButton.tsx
│   │   ├── hooks/               # Feature-specific hooks
│   │   │   └── useLogin.ts
│   │   ├── services/            # Feature-specific API calls
│   │   │   └── login.service.ts
│   │   ├── types/               # Feature-specific types
│   │   │   └── login.types.ts
│   │   ├── LoginPage.tsx        # Page/Screen component
│   │   └── index.ts             # Public API (re-exports)
│   ├── password-recovery/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── ...
│   └── mfa/
│       └── ...
├── shared/                      # Cross-feature shared code
│   ├── components/              # Reusable UI (non-domain specific)
│   │   └── Loading.tsx
│   ├── hooks/                   # Shared hooks
│   │   └── useLocalStorage.ts
│   ├── services/                # Shared services
│   │   └── analytics.service.ts
│   ├── utils/                   # Utility functions
│   │   └── validation.ts
│   └── types/                   # Shared types
│       └── common.types.ts
├── config/                      # App configuration
│   └── routes.ts
└── app/                         # App bootstrap
    ├── App.tsx
    ├── providers.tsx
    └── router.tsx
```

### Mobile App Structure

```
apps/mobile/src/
├── features/
│   ├── auth/
│   │   ├── screens/             # Screens instead of pages
│   │   │   ├── LoginScreen.tsx
│   │   │   └── BiometricScreen.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── index.ts
│   ├── dashboard/
│   ├── accounts/
│   └── transfers/
├── shared/
│   ├── components/
│   ├── hooks/
│   └── navigation/
│       ├── RootNavigator.tsx
│       └── types.ts
├── constants/
│   ├── colors.ts
│   ├── spacing.ts
│   └── typography.ts
└── app/
    └── App.tsx
```

---

## Module Boundaries

### Feature Public API

Each feature exposes only what's needed via `index.ts`:

```typescript
// features/login/index.ts
// Only export what other features need
export { LoginPage } from './LoginPage';
export type { LoginCredentials } from './types/login.types';

// Don't export internal components/hooks
// export { LoginForm } from './components/LoginForm'; // INTERNAL
```

### Import Rules

```typescript
// GOOD: Import from feature's public API
import { LoginPage } from '@/features/login';

// BAD: Import from feature internals
import { LoginForm } from '@/features/login/components/LoginForm';

// GOOD: Import shared utilities
import { Loading } from '@/shared/components';
import { useLocalStorage } from '@/shared/hooks';
```

### Dependency Direction

```
┌─────────────────────────────────────────┐
│                  app/                   │
│         (bootstraps everything)         │
└────────────────────┬────────────────────┘
                     │ imports
                     ▼
┌─────────────────────────────────────────┐
│              features/*                 │
│     (self-contained domain modules)     │
└────────────────────┬────────────────────┘
                     │ imports
                     ▼
┌─────────────────────────────────────────┐
│               shared/                   │
│      (cross-cutting utilities)          │
└────────────────────┬────────────────────┘
                     │ imports
                     ▼
┌─────────────────────────────────────────┐
│           @repo/* packages              │
│        (ui, core, types, etc.)          │
└─────────────────────────────────────────┘
```

**Rules:**
- Features can import from `shared/` and `@repo/*`
- Features must NOT import from other features (use events/stores for communication)
- `shared/` can only import from `@repo/*`
- `app/` can import from anywhere

---

## Scalability Patterns

### When to Create a Feature

Create a new feature folder when:
- It has its own page/screen
- It has domain-specific logic (services, types, hooks)
- It can be developed/tested independently

### When to Move to Shared

Move code to `shared/` when:
- Used by 2+ features
- Not domain-specific (generic utilities)
- Could be reused in other apps

### When to Extract to Package

Move code to `packages/` when:
- Used by 2+ apps (web + mobile)
- Stable API, versioned independently
- Example: `@repo/core` for shared services

### File Size Guidelines

| Threshold | Action |
|-----------|--------|
| Component > 200 lines | Split into sub-components |
| Hook > 100 lines | Extract helper functions |
| Service > 150 lines | Split by responsibility |
| Feature > 15 files | Consider sub-features |

---

## Colocation Principle

Keep related code close together:

```typescript
// GOOD: Feature-specific hook lives with feature
features/transfers/
├── hooks/
│   └── useTransfer.ts    // Only used by transfers
└── TransferPage.tsx

// GOOD: Shared hook in shared folder
shared/hooks/
└── useDebounce.ts        // Used by multiple features

// BAD: All hooks in root hooks folder
src/hooks/
├── useTransfer.ts        // Transfer-specific
├── useAccounts.ts        // Accounts-specific
└── useDebounce.ts        // Shared
```

---

## Microfrontends (Module Federation)

### Shell (Host)
```typescript
// apps/web-shell/vite.config.ts
federation({
  name: 'shell',
  remotes: {
    webAuth: 'http://localhost:3001/assets/remoteEntry.js',
  },
  shared: ['react', 'react-dom', 'react-router-dom', 'zustand'],
})
```

### Remote
```typescript
// apps/web-auth/vite.config.ts
federation({
  name: 'webAuth',
  filename: 'remoteEntry.js',
  exposes: {
    './LoginPage': './src/pages/LoginPage.tsx',
  },
  shared: ['react', 'react-dom', 'react-router-dom', 'zustand'],
})
```

### Loading Remotes
```typescript
const LoginPage = React.lazy(() => import('webAuth/LoginPage'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginPage />
    </Suspense>
  );
}
```

---

## Package Naming

Use `@repo/` prefix for all internal packages:

| Package | Name |
|---------|------|
| Web UI | `@repo/ui` |
| Mobile UI | `@repo/ui-mobile` |
| TypeScript Config | `@repo/typescript-config` |
| ESLint Config | `@repo/eslint-config` |
| Shared Types | `@repo/types` |
| Core Utilities | `@repo/core` |

---

## State Management

### Zustand (Global State)
```typescript
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (credentials) => {
    const user = await authService.login(credentials);
    set({ user, isAuthenticated: true });
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

### React Query (Server State)
```typescript
const QUERY_KEYS = {
  accounts: ['accounts'] as const,
  account: (id: string) => ['accounts', id] as const,
};

export function useAccounts() {
  return useQuery({
    queryKey: QUERY_KEYS.accounts,
    queryFn: () => accountsService.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}
```

---

## API Layer

```typescript
// packages/core/src/api/apiClient.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Environment Variables

```bash
# Web apps: VITE_ prefix
VITE_API_URL=https://api.example.com
VITE_APP_ENV=development

# Mobile: use react-native-config
API_URL=https://api.example.com
APP_ENV=development
```

---

## Build Pipeline

```bash
# Install dependencies
pnpm install

# Development (all apps)
pnpm dev

# Build all packages first, then apps
pnpm build

# Lint all
pnpm lint

# Type check all
pnpm typecheck
```
