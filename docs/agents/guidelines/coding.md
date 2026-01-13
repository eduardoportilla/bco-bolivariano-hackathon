# Coding Guidelines

## General Rules

- No emojis in code, comments, or variable names
- Always include all necessary imports
- Use named exports over default exports
- No `console.log` in production code
- No hardcoded secrets or API keys
- Spanish for user-facing text, English for code

---

## TypeScript

### Strict Mode
- Enabled in all packages
- No implicit `any` - use `unknown` when type is uncertain
- Explicit return types on exported functions

### Types vs Interfaces
```typescript
// Use interface for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// Use type for unions, primitives, utilities
type Status = 'active' | 'inactive' | 'pending';
type UserWithRole = User & { role: string };
```

### Naming
- Interfaces: `PascalCase` (no `I` prefix)
- Types: `PascalCase`
- Constants: `SCREAMING_SNAKE_CASE`
- Functions/variables: `camelCase`

---

## React Components

### Structure
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ variant, children, onClick, disabled }: ButtonProps) {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={cn('btn', `btn-${variant}`)}
    >
      {children}
    </button>
  );
}
```

### Rules
- One component per file
- Props interface above component
- Destructure props in function signature
- Use `React.ReactNode` for children

---

## File Naming

| Type | Convention | Example |
|------|------------|---------|
| Component | `PascalCase.tsx` | `LoginForm.tsx` |
| Hook | `camelCase.ts` | `useAuth.ts` |
| Utility | `camelCase.ts` | `formatters.ts` |
| Types | `*.types.ts` | `auth.types.ts` |
| Test | `*.test.ts` | `Button.test.ts` |
| Styles | `*.css` | `globals.css` |

---

## Import Order

```typescript
// 1. React and external libraries
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Internal packages
import { Button } from '@repo/ui';
import { apiClient } from '@repo/core';

// 3. Relative imports
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from './LoginForm';

// 4. Type-only imports
import type { User } from '@repo/types';

// 5. Styles
import './styles.css';
```

---

## Error Handling

```typescript
try {
  const result = await apiClient.post('/transfers', data);
  return result;
} catch (error) {
  if (error instanceof ApiError) {
    // Handle known errors
    throw new TransferError('Fondos insuficientes');
  }
  // Log and rethrow unexpected errors
  logger.error('Transfer failed', { error });
  throw new TransferError('Error al procesar la transferencia');
}
```

---

## Forbidden Patterns

```typescript
// Never use any unless type is complex or unknown
const data: any = response; // BAD

// Never use default exports
export default function Button() {} // BAD

// Never leave missing imports
// import { Button } from '@repo/ui'; // MISSING - BAD

// Never hardcode secrets
const API_KEY = 'sk-12345'; // BAD

// Never use console.log in production
console.log('debug', data); // BAD
```
