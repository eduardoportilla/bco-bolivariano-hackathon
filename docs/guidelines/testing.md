# Testing Guidelines

Best practices for testing across packages, web apps, and mobile apps.

---

## Testing Stack

| Platform | Unit/Integration | E2E |
|----------|------------------|-----|
| Packages | Vitest | - |
| Web Apps | Vitest + React Testing Library | Playwright |
| Mobile | Jest + React Testing Library | Detox |

---

## Test Organization (Hybrid Structure)

Use a hybrid approach for organizing tests:

| Test Type | Location | Purpose |
|-----------|----------|---------|
| Unit | Co-located `*.test.ts` | Single function/component |
| Integration | `__tests__/integration/` | Multi-feature flows |
| E2E | `e2e/` | Full user journeys |
| Test utilities | `src/test/` or `test/` | Mocks, factories, setup |

### Packages (e.g., @repo/core)

```
packages/core/
├── src/
│   ├── domains/
│   │   └── accounts/
│   │       ├── service.ts
│   │       └── service.test.ts     # Co-located unit test
│   └── shared/
│       └── utils/
│           ├── formatters.ts
│           └── formatters.test.ts  # Co-located unit test
├── test/
│   ├── mocks/
│   │   └── http.mock.ts            # Shared mock HttpClient
│   └── factories/
│       └── account.factory.ts      # Test data factories
└── vitest.config.ts
```

### Web Apps

```
apps/web-shell/
├── src/
│   ├── features/
│   │   └── auth/
│   │       ├── components/
│   │       │   ├── LoginForm.tsx
│   │       │   └── LoginForm.test.tsx   # Component unit test
│   │       └── hooks/
│   │           ├── useLogin.ts
│   │           └── useLogin.test.ts     # Hook unit test
│   └── test/
│       ├── setup.ts                     # Vitest setup
│       ├── mocks/
│       │   ├── handlers.ts              # MSW handlers
│       │   └── server.ts                # MSW server
│       ├── factories/
│       │   └── account.factory.ts
│       └── utils/
│           └── render.tsx               # Custom render with providers
├── __tests__/
│   └── integration/
│       └── transfer-flow.test.ts        # Integration test
└── e2e/
    └── auth.spec.ts                     # Playwright E2E
```

### Mobile Apps

```
apps/mobile/
├── src/
│   ├── features/
│   │   └── auth/
│   │       ├── screens/
│   │       │   ├── LoginScreen.tsx
│   │       │   └── LoginScreen.test.tsx
│   │       └── hooks/
│   │           ├── useLogin.ts
│   │           └── useLogin.test.ts
│   └── test/
│       ├── setup.ts
│       ├── mocks/
│       └── factories/
└── e2e/
    └── auth.e2e.ts                      # Detox E2E
```

---

## Test Structure (AAA Pattern)

All tests must follow the **Arrange-Act-Assert** pattern:

```typescript
describe('TransferService', () => {
  it('should create a transfer successfully', async () => {
    // Arrange - Set up test data and dependencies
    const mockAccount = createMockAccount({ balance: 1000 });
    const transferData = { amount: 100, toAccountId: '123' };

    // Act - Execute the code under test
    const result = await transferService.create(transferData);

    // Assert - Verify the expected outcome
    expect(result.status).toBe('completed');
    expect(result.amount).toBe(100);
  });
});
```

---

## Packages (Vitest)

### Configuration

```typescript
// packages/core/vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules', 'dist', '**/*.test.ts'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
```

### Service Test Example

```typescript
// src/domains/accounts/service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { HttpClient } from '../../adapters';
import { createAccountsService } from './service';

describe('AccountsService', () => {
  let mockHttp: HttpClient;
  let service: ReturnType<typeof createAccountsService>;

  beforeEach(() => {
    mockHttp = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    };
    service = createAccountsService(mockHttp);
  });

  it('should return list of accounts', async () => {
    // Arrange
    const mockAccounts = [{ id: '1', name: 'Cuenta' }];
    vi.mocked(mockHttp.get).mockResolvedValue({ accounts: mockAccounts });

    // Act
    const result = await service.getAll();

    // Assert
    expect(mockHttp.get).toHaveBeenCalledWith('/accounts');
    expect(result).toEqual(mockAccounts);
  });
});
```

---

## Web Apps (Vitest + React Testing Library)

### Configuration

```typescript
// apps/web-shell/vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: true,
  },
});
```

### Test Setup

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

### Component Test Example

```typescript
// src/features/auth/components/LoginForm.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('should submit with valid credentials', async () => {
    // Arrange
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    // Act
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /iniciar sesion/i }));

    // Assert
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
```

### Hook Test Example

```typescript
// src/features/accounts/hooks/useAccounts.test.ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAccounts } from './useAccounts';

const wrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('useAccounts', () => {
  it('should fetch accounts', async () => {
    // Mock the service
    vi.mock('@/services', () => ({
      accountsService: {
        getAll: vi.fn().mockResolvedValue([{ id: '1', name: 'Cuenta' }]),
      },
    }));

    // Act
    const { result } = renderHook(() => useAccounts(), { wrapper });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
  });
});
```

---

## Web E2E (Playwright)

### Configuration

```typescript
// apps/web-shell/playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Example

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login successfully', async ({ page }) => {
    // Arrange
    await page.goto('/login');

    // Act
    await page.getByLabel(/email/i).fill('user@example.com');
    await page.getByLabel(/password/i).fill('validPassword123');
    await page.getByRole('button', { name: /iniciar sesion/i }).click();

    // Assert
    await expect(page).toHaveURL('/dashboard');
  });
});
```

---

## Mobile Apps (Jest + React Testing Library)

### Configuration

```javascript
// apps/mobile/jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  testMatch: ['**/*.test.{ts,tsx}'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

### Test IDs for Detox

Add testID to components for E2E testing:

```typescript
<TextInput
  testID="email-input"
  placeholder="Email"
  value={email}
  onChangeText={setEmail}
/>

<Pressable testID="login-button" onPress={handleLogin}>
  <Text>Iniciar Sesion</Text>
</Pressable>
```

---

## Coverage Requirements

| Type | Minimum Coverage |
|------|------------------|
| Packages (@repo/core) | 80% |
| Web Components | 70% |
| Mobile Components | 70% |
| E2E | Critical paths |

---

## Commands

```bash
# All tests
pnpm test

# Packages
pnpm --filter @repo/core test
pnpm --filter @repo/core test:cov

# Web
pnpm --filter web-shell test
pnpm --filter web-shell test:e2e

# Mobile
pnpm --filter mobile test
pnpm --filter mobile test:e2e:ios
pnpm --filter mobile test:e2e:android
```

---

## Best Practices

1. **Test behavior, not implementation** - Focus on what the component does
2. **Use accessible queries** - Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **One assertion per behavior** - Keep tests focused
4. **Avoid testing library internals** - Test your code, not React
5. **Use realistic data** - Create factory functions for test data
6. **Clean up after tests** - Reset mocks and state between tests
7. **Keep tests fast** - Mock heavy dependencies
8. **Name tests clearly** - Use `should [expected behavior] when [condition]`
9. **Co-locate unit tests** - Keep `*.test.ts` next to source files
10. **Separate integration tests** - Use `__tests__/integration/` for multi-feature tests
