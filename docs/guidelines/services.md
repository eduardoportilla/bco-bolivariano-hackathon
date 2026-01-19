# Services and Patterns Guidelines

Standards for API services, configuration, forms, state management, and error handling.

---

## HTTP Client Factory

The `@repo/core` package provides a `createHttpClient` factory that reduces code duplication across platforms while allowing platform-specific customization.

> **Important:** Always use the `createHttpClient` factory from `@repo/core/adapters`. Do not use the native `fetch` API or create axios instances directly in apps.

### Factory API

```typescript
import { createHttpClient } from '@repo/core/adapters';

// Configuration options
interface HttpClientConfig {
  baseURL: string;              // Required: API base URL
  timeout?: number;             // Default: 30000ms
  withCredentials?: boolean;    // Default: false (for cookie auth)
  headers?: Record<string, string>;
}

// Interceptors for platform-specific behavior
interface HttpClientInterceptors {
  onRequest?: (config) => config | Promise<config>;
  onResponse?: (response) => response;
  onError?: (error) => Promise<never>;
}
```

### Web Implementation

```typescript
// apps/web-*/src/adapters/http.web.ts
import { createHttpClient } from '@repo/core/adapters';

export const httpClient = createHttpClient(
  {
    baseURL: import.meta.env.VITE_API_URL || '/api',
    withCredentials: true, // Send httpOnly cookies
  },
  {
    onError: (error) => {
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
      return Promise.reject(error.response?.data ?? error);
    },
  }
);
```

### Mobile Implementation

```typescript
// apps/mobile/src/adapters/http.mobile.ts
import Config from 'react-native-config';
import { createHttpClient } from '@repo/core/adapters';
import { secureStorage } from '../services/security/secureStorage';

export const httpClient = createHttpClient(
  {
    baseURL: Config.API_URL || 'http://localhost:3000/api',
  },
  {
    onRequest: async (config) => {
      const token = await secureStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    onError: async (error) => {
      if (error.response?.status === 401) {
        await secureStorage.removeItem('accessToken');
        await secureStorage.removeItem('refreshToken');
      }
      return Promise.reject(error.response?.data ?? error);
    },
  }
);
```

### Benefits

- **Reduced duplication**: Common config (timeout, headers, Content-Type) defined once in factory
- **Platform flexibility**: Each app can customize auth, error handling, base URL
- **Type safety**: Full TypeScript support with `HttpClient` interface
- **Testability**: Easy to mock the `HttpClient` interface in tests

---

## Service Pattern

Services encapsulate API calls and return typed responses:

```typescript
// features/accounts/services/account.service.ts
import { apiClient } from '@/shared/services/api/client';
import type { Account, AccountsResponse } from '../types/account.types';

export const accountService = {
  getAll: async (): Promise<Account[]> => {
    const response = await apiClient.get<AccountsResponse>('/accounts');
    return response.data.accounts;
  },

  getById: async (id: string): Promise<Account> => {
    const response = await apiClient.get<Account>(`/accounts/${id}`);
    return response.data;
  },

  create: async (data: CreateAccountData): Promise<Account> => {
    const response = await apiClient.post<Account>('/accounts', data);
    return response.data;
  },
};
```

### Service File Naming

| Type | File Name | Example |
|------|-----------|---------|
| Feature service | `[feature].service.ts` | `account.service.ts` |
| Shared service | `[name].service.ts` | `analytics.service.ts` |
| API client | `client.ts` | `client.ts` |

---

## React Query Patterns

### Query Keys

Define query keys as constants for consistency:

```typescript
// features/accounts/constants/queryKeys.ts
export const ACCOUNT_KEYS = {
  all: ['accounts'] as const,
  lists: () => [...ACCOUNT_KEYS.all, 'list'] as const,
  list: (filters: AccountFilters) => [...ACCOUNT_KEYS.lists(), filters] as const,
  details: () => [...ACCOUNT_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ACCOUNT_KEYS.details(), id] as const,
};
```

### Custom Hooks

```typescript
// features/accounts/hooks/useAccounts.ts
import { useQuery } from '@tanstack/react-query';
import { accountService } from '../services/account.service';
import { ACCOUNT_KEYS } from '../constants/queryKeys';

export function useAccounts() {
  return useQuery({
    queryKey: ACCOUNT_KEYS.lists(),
    queryFn: accountService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: ACCOUNT_KEYS.detail(id),
    queryFn: () => accountService.getById(id),
    enabled: !!id,
  });
}
```

### Mutations

```typescript
// features/transfers/hooks/useCreateTransfer.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transferService } from '../services/transfer.service';
import { ACCOUNT_KEYS } from '@/features/accounts/constants/queryKeys';

export function useCreateTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transferService.create,
    onSuccess: () => {
      // Invalidate affected queries
      queryClient.invalidateQueries({ queryKey: ACCOUNT_KEYS.all });
    },
    onError: (error) => {
      // Handle error (toast, etc.)
    },
  });
}
```

---

## Zustand Store Patterns

### Store Structure

```typescript
// store/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
```

### Selectors

```typescript
// Prefer selectors to avoid unnecessary re-renders
const user = useAuthStore((state) => state.user);
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

// Avoid: subscribes to entire store
const { user, isAuthenticated } = useAuthStore();
```

---

## Forms (react-hook-form + zod)

### Schema Definition

```typescript
// features/transfers/schemas/transfer.schema.ts
import { z } from 'zod';

export const transferSchema = z.object({
  fromAccountId: z.string().min(1, 'Seleccione cuenta origen'),
  toAccountId: z.string().min(1, 'Seleccione cuenta destino'),
  amount: z
    .number({ error: 'Ingrese un monto valido' })  // Zod v4 uses 'error' instead of 'invalid_type_error'
    .positive('El monto debe ser mayor a 0')
    .max(10000, 'Monto maximo excedido'),
  description: z.string().max(100).optional(),
});

export type TransferFormData = z.infer<typeof transferSchema>;
```

### Form Component

```typescript
// features/transfers/components/TransferForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transferSchema, type TransferFormData } from '../schemas/transfer.schema';

interface TransferFormProps {
  onSubmit: (data: TransferFormData) => void;
  isLoading?: boolean;
}

export function TransferForm({ onSubmit, isLoading }: TransferFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      amount: 0,
      description: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('amount', { valueAsNumber: true })}
        type="number"
        label="Monto"
        error={errors.amount?.message}
      />
      <Input
        {...register('description')}
        label="Descripcion (opcional)"
        error={errors.description?.message}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Procesando...' : 'Transferir'}
      </Button>
    </form>
  );
}
```

### Form File Structure

```
features/transfers/
├── schemas/
│   └── transfer.schema.ts    # Zod schemas
├── components/
│   └── TransferForm.tsx      # Form component
├── hooks/
│   └── useCreateTransfer.ts  # Mutation hook
└── TransferPage.tsx          # Orchestrates form + mutation
```

---

## Configuration Management

### Environment Variables

**Web (.env files):**

```bash
# .env.development
VITE_API_URL=http://localhost:3000/api
VITE_APP_ENV=development

# .env.production
VITE_API_URL=https://api.example.com
VITE_APP_ENV=production
```

**Mobile (react-native-config):**

```bash
# .env.development
API_URL=http://localhost:3000/api
APP_ENV=development

# .env.production
API_URL=https://api.example.com
APP_ENV=production
```

### Config Accessor

```typescript
// shared/config/env.ts (Web)
export const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  appEnv: import.meta.env.VITE_APP_ENV,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;

// config/env.ts (Mobile)
import Config from 'react-native-config';

export const config = {
  apiUrl: Config.API_URL,
  appEnv: Config.APP_ENV,
  isDev: Config.APP_ENV === 'development',
  isProd: Config.APP_ENV === 'production',
} as const;
```

---

## Error Handling

### API Error Types

```typescript
// shared/types/errors.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public fields: Record<string, string>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

### Error Boundaries (Web)

```typescript
// shared/components/ErrorBoundary.tsx
import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // Log to monitoring service
    logger.error('React error boundary', { error });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

---

## Logging

### Logger Utility

```typescript
// shared/utils/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

const log = (level: LogLevel, message: string, context?: LogContext) => {
  if (config.isProd && level === 'debug') return;

  const timestamp = new Date().toISOString();
  const logData = { timestamp, level, message, ...context };

  // In production, send to monitoring service
  if (config.isProd) {
    // sendToMonitoring(logData);
  } else {
    // eslint-disable-next-line no-console
    console[level](JSON.stringify(logData));
  }
};

export const logger = {
  debug: (message: string, context?: LogContext) => log('debug', message, context),
  info: (message: string, context?: LogContext) => log('info', message, context),
  warn: (message: string, context?: LogContext) => log('warn', message, context),
  error: (message: string, context?: LogContext) => log('error', message, context),
};
```

### Usage

```typescript
// ALLOWED
logger.info('Transfer initiated', { userId: user.id, amount });
logger.error('Transfer failed', { errorCode: 'INSUFFICIENT_FUNDS' });

// FORBIDDEN - sensitive data
logger.debug('Token:', accessToken);       // NEVER
logger.info('Card:', cardNumber);          // NEVER
```

---

## Response Validation

Always validate API responses with zod:

```typescript
// features/accounts/services/account.service.ts
import { z } from 'zod';

const accountSchema = z.object({
  id: z.string(),
  name: z.string(),
  balance: z.number(),
  currency: z.string(),
});

const accountsResponseSchema = z.object({
  accounts: z.array(accountSchema),
});

export const accountService = {
  getAll: async () => {
    const response = await apiClient.get('/accounts');
    return accountsResponseSchema.parse(response.data).accounts;
  },
};
```

---

## Mock API Mode (MSW)

The project uses [Mock Service Worker (MSW)](https://mswjs.io/) to enable development without a backend. This provides network-level API mocking that works transparently with all HTTP clients.

### Configuration

Mock mode is controlled via environment variables:

| Platform | Variable | Values |
|----------|----------|--------|
| Web | `VITE_API_MOCK` | `true` / `false` |
| Mobile | `API_MOCK` | `true` / `false` |

### Mock Handlers Location

All MSW handlers are centralized in `@repo/core/test/mocks/`:

```
packages/core/src/test/mocks/
├── handlers.ts   # Request handlers for all endpoints
├── browser.ts    # Web apps (msw/browser)
├── native.ts     # React Native (msw/native)
└── index.ts      # Exports
```

**Why in core?** Since services are defined in `@repo/core`, their mocks live there too. This ensures consistency across all apps and prevents duplication.

### Service Worker Setup (Web Only)

Web apps require the MSW service worker script in the `public/` folder. This is already set up, but if you need to regenerate it:

```bash
# From app directory
npx msw init public --save
```

The `mockServiceWorker.js` file should be committed to the repository.

### Web Apps Setup

```typescript
// apps/web-*/src/main.tsx
async function enableMocking() {
  if (import.meta.env.VITE_API_MOCK !== 'true') {
    return;
  }

  // Use platform-specific import to avoid bundling msw/native in web builds
  const { worker } = await import('@repo/core/test/mocks/browser');
  return worker.start({ onUnhandledRequest: 'warn' });
}

enableMocking().then(() => {
  createRoot(rootElement).render(<App />);
});
```

### Mobile App Setup

```typescript
// apps/mobile/index.js
import Config from 'react-native-config';

async function enableMocking() {
  if (!__DEV__ || Config.API_MOCK !== 'true') {
    return;
  }

  await import('./msw.polyfills');
  // Use platform-specific import for React Native
  const { server } = await import('@repo/core/test/mocks/native');
  server.listen({ onUnhandledRequest: 'warn' });
}

enableMocking().then(() => {
  AppRegistry.registerComponent(appName, () => App);
});
```

Mobile requires polyfills (`fast-text-encoding`, `react-native-url-polyfill`) installed as dev dependencies.

### Adding New Mock Handlers

```typescript
// packages/core/src/test/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Use wildcard prefix to match any base URL
  http.get('*/accounts', () => {
    return HttpResponse.json({ accounts: MOCK_ACCOUNTS });
  }),

  http.post('*/transfers', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: 'txn-123', ...body }, { status: 201 });
  }),

  // Return errors for testing
  http.get('*/error-endpoint', () => {
    return new HttpResponse(null, { status: 500 });
  }),
];
```

### Development Modes

| Mode | Mock | Backend | Use Case |
|------|------|---------|----------|
| **Mock** | `true` | Not required | UI development, offline work, demos |
| **Real** | `false` | Required | Integration testing, full stack dev |

**Web Real Mode (Shared Cookie):**
When `VITE_API_MOCK=false`, web apps connect to the real backend. On localhost, auth cookies are shared across ports, so logging in via `web-shell:3000` automatically authenticates `web-accounts:3001`.

**Mobile Real Mode:**
Set `API_MOCK=false` in `.env` and ensure `API_URL` points to your backend.
