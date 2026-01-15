# Architecture Guidelines

## Monorepo Structure

```
bbh/
├── apps/
│   ├── web-shell/         # Host MFE (owns auth routes)
│   ├── web-accounts/      # Accounts MFE (remote)
│   └── mobile/            # React Native app
├── packages/
│   ├── core/              # Shared business logic (@repo/core)
│   ├── ui-web/            # Web design system (@repo/ui)
│   ├── typescript-config/ # Shared TS configs
│   └── eslint-config/     # Shared ESLint configs
├── docs/                  # Documentation
└── scripts/               # Build and utility scripts
```

---

## Core Package (@repo/core)

The `@repo/core` package contains shared business logic that is used by both web and mobile apps.

### Structure (Hybrid Domain-Based)

```
packages/core/src/
├── adapters/                 # Platform adapter interfaces
│   ├── http.adapter.ts       # HttpClient interface
│   └── storage.adapter.ts    # SecureStorage interface
├── domains/                  # Business domains
│   ├── auth/
│   │   ├── types.ts          # User, LoginCredentials
│   │   ├── schema.ts         # Zod validation schemas
│   │   ├── service.ts        # createAuthService(http)
│   │   ├── service.test.ts   # Co-located tests
│   │   ├── queries.ts        # React Query keys
│   │   └── index.ts
│   ├── accounts/
│   │   └── ...
│   └── transfers/
│       └── ...
└── shared/                   # Cross-cutting utilities
    ├── utils/
    │   ├── formatters.ts
    │   └── validators.ts
    └── constants/
        ├── api.ts            # API_ENDPOINTS
        └── errors.ts         # ERROR_CODES
```

### Adapter Pattern

The core package uses dependency injection via adapters to allow platform-specific implementations:

```typescript
// packages/core/src/adapters/http.adapter.ts
export interface HttpClient {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data?: unknown): Promise<T>;
  put<T>(url: string, data?: unknown): Promise<T>;
  delete<T>(url: string): Promise<T>;
}

// packages/core/src/domains/accounts/service.ts
export function createAccountsService(http: HttpClient) {
  return {
    getAll: () => http.get<Account[]>(API_ENDPOINTS.accounts.list),
    getById: (id: string) => http.get<Account>(API_ENDPOINTS.accounts.detail(id)),
  };
}
```

Each app provides its own adapter implementation:

```typescript
// apps/web-shell/src/adapters/http.web.ts
// Uses axios with httpOnly cookies

// apps/mobile/src/adapters/http.mobile.ts
// Uses axios with Keychain/Keystore tokens
```

### Usage in Apps

```typescript
// apps/web-shell/src/services/index.ts
import { httpClient } from '../adapters/http.web';
import { createAccountsService } from '@repo/core/domains/accounts';

export const accountsService = createAccountsService(httpClient);
```

### What Goes in Core

| Include | Exclude |
|---------|---------|
| Types/interfaces | React components |
| Zod validation schemas | Platform-specific code |
| Service factories | UI logic |
| Query key factories | Navigation |
| Utility functions | Storage implementations |
| Constants | HTTP client implementations |

---

## Feature-Based Organization

Organize application code by **feature/domain**, not by file type.

### Web App Structure

```
apps/web-shell/src/
├── adapters/
│   └── http.web.ts              # HttpClient implementation
├── services/
│   └── index.ts                 # Wired services from @repo/core
├── features/                    # Feature modules (domain-driven)
│   ├── auth/
│   │   ├── components/
│   │   │   └── LoginForm.tsx
│   │   ├── hooks/               # useLogin, useAuth, useLogout
│   │   │   ├── useLogin.ts
│   │   │   ├── useAuth.ts
│   │   │   └── index.ts
│   │   ├── LoginPage.tsx
│   │   └── index.ts
│   ├── accounts/
│   │   ├── components/
│   │   ├── hooks/               # useAccounts, useAccount
│   │   └── ...
│   └── transfers/
│       ├── components/
│       ├── hooks/               # useTransfers, useCreateTransfer
│       └── ...
├── shared/                      # Cross-feature shared code
│   ├── components/
│   ├── hooks/
│   └── utils/
├── test/                        # Test utilities
│   ├── setup.ts
│   ├── mocks/
│   └── factories/
└── app/
    ├── App.tsx
    ├── providers.tsx
    └── router.tsx
```

### Mobile App Structure

```
apps/mobile/src/
├── adapters/
│   └── http.mobile.ts           # HttpClient implementation
├── services/
│   ├── index.ts                 # Wired services from @repo/core
│   └── security/
│       └── secureStorage.ts     # Keychain/Keystore
├── features/
│   ├── auth/
│   │   ├── screens/
│   │   │   └── LoginScreen.tsx
│   │   ├── components/
│   │   ├── hooks/               # useLogin, useAuth, useLogout
│   │   └── index.ts
│   ├── accounts/
│   │   ├── hooks/               # useAccounts, useAccount
│   │   └── ...
│   └── transfers/
├── components/
│   └── ui/                      # Reusable UI components
├── navigation/
├── constants/
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

### Routing Strategy (Hybrid Approach)

- **Shell owns:** Top-level routing, auth routes (cross-cutting concern), browser history
- **Microfrontends own:** Internal routing within their domain prefix

Auth is not a separate microfrontend because it's infrastructure, not a business domain.

### Shell (Host)
```typescript
// apps/web-shell/vite.config.ts
federation({
  name: 'shell',
  remotes: {
    webAccounts: 'http://localhost:3001/assets/remoteEntry.js',
  },
  shared: ['react', 'react-dom', 'react-router-dom', 'zustand'],
})
```

### Remote (with internal routing)
```typescript
// apps/web-accounts/vite.config.ts
federation({
  name: 'webAccounts',
  filename: 'remoteEntry.js',
  exposes: {
    './App': './src/App.tsx',  // Exposes App with internal router
  },
  shared: ['react', 'react-dom', 'react-router-dom', 'zustand'],
})

// apps/web-accounts/src/App.tsx
// Uses Routes (not BrowserRouter) since shell provides the router
export function App() {
  return (
    <Routes>
      <Route index element={<AccountsListPage />} />
      <Route path=":id" element={<AccountDetailsPage />} />
    </Routes>
  );
}
```

### Loading Remotes
```typescript
const AccountsApp = React.lazy(() => import('webAccounts/App'));

function App() {
  return (
    <Routes>
      {/* Auth routes owned by shell */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Microfrontend with wildcard for internal routing */}
      <Route
        path="/accounts/*"
        element={
          <ErrorBoundary fallback={<RemoteUnavailable />}>
            <Suspense fallback={<Loading />}>
              <AccountsApp />
            </Suspense>
          </ErrorBoundary>
        }
      />
    </Routes>
  );
}
```

---

## Package Naming

Use `@repo/` prefix for all internal packages:

| Package | Import Name | Folder |
|---------|-------------|--------|
| Web UI | `@repo/ui` | `packages/ui-web` |
| TypeScript Config | `@repo/typescript-config` | `packages/typescript-config` |
| ESLint Config | `@repo/eslint-config` | `packages/eslint-config` |
| Shared Types | `@repo/types` | `packages/types` (when needed) |
| Core Utilities | `@repo/core` | `packages/core` (when needed) |

> **Note:** Mobile components are colocated in `apps/mobile/src/components/` and do not have a separate package.

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
