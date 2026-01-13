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
