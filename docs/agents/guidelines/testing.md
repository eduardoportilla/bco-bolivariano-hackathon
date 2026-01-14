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

## File Organization

### Packages

```
packages/core/
├── src/
│   ├── utils/
│   │   └── formatters.ts
│   └── services/
│       └── auth.service.ts
└── __tests__/
    ├── utils/
    │   └── formatters.test.ts
    └── services/
        └── auth.service.test.ts
```

### Web Apps

```
apps/web-auth/
├── src/
│   ├── components/
│   │   └── LoginForm/
│   │       ├── LoginForm.tsx
│   │       └── LoginForm.test.tsx   # Co-located
│   └── pages/
│       └── LoginPage.tsx
└── e2e/
    └── auth.spec.ts                  # Playwright
```

### Mobile Apps

```
apps/mobile/
├── src/
│   ├── components/
│   │   └── Button/
│   │       ├── Button.tsx
│   │       └── Button.test.tsx      # Co-located
│   └── screens/
│       └── LoginScreen.tsx
└── e2e/
    └── auth.e2e.ts                   # Detox
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
    include: ['__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules', '__tests__'],
    },
  },
});
```

### Unit Test Example

```typescript
// __tests__/utils/formatters.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from '../../src/utils/formatters';

describe('formatCurrency', () => {
  it('should format USD amounts correctly', () => {
    // Arrange
    const amount = 1234.56;

    // Act
    const result = formatCurrency(amount, 'USD');

    // Assert
    expect(result).toBe('$1,234.56');
  });

  it('should handle zero amounts', () => {
    expect(formatCurrency(0, 'USD')).toBe('$0.00');
  });
});
```

---

## Web Apps (Vitest + React Testing Library)

### Configuration

```typescript
// apps/web-auth/vitest.config.ts
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
// src/components/LoginForm/LoginForm.test.tsx
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

  it('should show error for invalid email', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<LoginForm onSubmit={vi.fn()} />);

    // Act
    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /iniciar sesion/i }));

    // Assert
    expect(screen.getByText(/email invalido/i)).toBeInTheDocument();
  });
});
```

### Hook Test Example

```typescript
// src/hooks/useAuth.test.ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './useAuth';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useAuth', () => {
  it('should return authenticated user', async () => {
    // Arrange
    vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser);

    // Act
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    // Assert
    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });
});
```

---

## Web E2E (Playwright)

### Configuration

```typescript
// apps/web-auth/playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Example

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    // Arrange
    await page.goto('/login');

    // Act
    await page.getByLabel(/email/i).fill('user@example.com');
    await page.getByLabel(/password/i).fill('validPassword123');
    await page.getByRole('button', { name: /iniciar sesion/i }).click();

    // Assert
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText(/bienvenido/i)).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Arrange
    await page.goto('/login');

    // Act
    await page.getByLabel(/email/i).fill('user@example.com');
    await page.getByLabel(/password/i).fill('wrongPassword');
    await page.getByRole('button', { name: /iniciar sesion/i }).click();

    // Assert
    await expect(page.getByText(/credenciales invalidas/i)).toBeVisible();
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

### Test Setup

```typescript
// src/test/setup.ts
import '@testing-library/react-native/extend-expect';
import { jest } from '@jest/globals';

// Mock react-native-keychain
jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
}));
```

### Component Test Example

```typescript
// src/components/Button/Button.test.tsx
import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('should render title correctly', () => {
    // Arrange & Act
    render(<Button title="Continuar" onPress={jest.fn()} />);

    // Assert
    expect(screen.getByText('Continuar')).toBeOnTheScreen();
  });

  it('should call onPress when tapped', () => {
    // Arrange
    const onPress = jest.fn();
    render(<Button title="Continuar" onPress={onPress} />);

    // Act
    fireEvent.press(screen.getByText('Continuar'));

    // Assert
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    // Arrange
    const onPress = jest.fn();
    render(<Button title="Continuar" onPress={onPress} disabled />);

    // Act
    fireEvent.press(screen.getByText('Continuar'));

    // Assert
    expect(onPress).not.toHaveBeenCalled();
  });
});
```

---

## Mobile E2E (Detox)

### Configuration

```javascript
// apps/mobile/.detoxrc.js
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js',
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/Mobile.app',
      build: 'xcodebuild -workspace ios/Mobile.xcworkspace -scheme Mobile -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: { type: 'iPhone 15' },
    },
    emulator: {
      type: 'android.emulator',
      device: { avdName: 'Pixel_7_API_34' },
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
  },
};
```

### E2E Test Example

```typescript
// e2e/auth.e2e.ts
import { device, element, by, expect } from 'detox';

describe('Authentication', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should login successfully with valid credentials', async () => {
    // Arrange - already on login screen

    // Act
    await element(by.id('email-input')).typeText('user@example.com');
    await element(by.id('password-input')).typeText('validPassword123');
    await element(by.id('login-button')).tap();

    // Assert
    await expect(element(by.id('dashboard-screen'))).toBeVisible();
    await expect(element(by.text('Bienvenido'))).toBeVisible();
  });

  it('should show error for invalid credentials', async () => {
    // Arrange - already on login screen

    // Act
    await element(by.id('email-input')).typeText('user@example.com');
    await element(by.id('password-input')).typeText('wrongPassword');
    await element(by.id('login-button')).tap();

    // Assert
    await expect(element(by.text('Credenciales invalidas'))).toBeVisible();
  });
});
```

---

## Test IDs for Mobile

Add testID to components for Detox:

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

## Mocking

### Vitest Mocks

```typescript
import { vi, describe, it, beforeEach } from 'vitest';
import { authService } from '@/services/auth';

vi.mock('@/services/auth');

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect after login', async () => {
    vi.mocked(authService.login).mockResolvedValue({ user: mockUser });
    // ... test code
  });
});
```

### Jest Mocks

```typescript
import { jest, describe, it, beforeEach } from '@jest/globals';

jest.mock('@/services/auth');

const mockAuthService = jest.mocked(authService);

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate after login', async () => {
    mockAuthService.login.mockResolvedValue({ user: mockUser });
    // ... test code
  });
});
```

---

## Coverage Requirements

| Type | Minimum Coverage |
|------|------------------|
| Packages | 80% |
| Web Components | 70% |
| Mobile Components | 70% |
| E2E | Critical paths |

---

## Commands

```bash
# Packages
pnpm --filter @repo/core test        # Run tests
pnpm --filter @repo/core test:cov    # With coverage

# Web
pnpm --filter web-auth test          # Unit tests
pnpm --filter web-auth test:e2e      # Playwright

# Mobile
pnpm --filter mobile test            # Jest tests
pnpm --filter mobile test:e2e:ios    # Detox iOS
pnpm --filter mobile test:e2e:android # Detox Android
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
