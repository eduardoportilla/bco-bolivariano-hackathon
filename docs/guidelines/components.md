# Component Guidelines

## File Structure

### When to Use Parent Folder vs Single File

| Condition | Structure | Example |
|-----------|-----------|---------|
| Simple component | Single file | `Button.tsx` |
| Component + test | Single file | `Button.tsx`, `Button.test.tsx` |
| 3+ related files | Parent folder | `LoginForm/` |

### Single File (Default)

Use for simple, self-contained components:

```
components/
├── Button.tsx
├── Button.test.tsx      # Test co-located
├── Input.tsx
├── Input.test.tsx
├── Card.tsx
└── index.ts             # Re-exports
```

### Parent Folder (When Needed)

Use when component has 3+ related files:

```
components/
└── LoginForm/
    ├── LoginForm.tsx        # Main component
    ├── LoginForm.test.tsx   # Tests
    ├── useLoginForm.ts      # Component-specific hook
    ├── LoginFormFields.tsx  # Sub-component
    └── index.ts             # Re-export
```

**Use parent folder when:**
- Component has a dedicated hook
- Component has multiple sub-components
- Component has complex test setup with mocks
- Component has related types/constants

---

## packages/ui-web Structure

Use flat structure (matches shadcn/ui pattern):

```
packages/ui-web/src/
├── components/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Dialog.tsx
│   └── index.ts
├── lib/
│   └── utils.ts          # cn() helper
└── styles/
    └── globals.css
```

> **Note:** We do not use Atomic Design (atoms/molecules/organisms) to keep the structure simple and consistent with shadcn/ui.

---

## Component Pattern

```typescript
import { cn } from '@repo/ui/lib/utils';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outlined';
}

export function Card({ 
  title, 
  children, 
  className,
  variant = 'default' 
}: CardProps) {
  return (
    <div 
      className={cn(
        'rounded-lg p-4',
        variant === 'default' && 'bg-card shadow-sm',
        variant === 'outlined' && 'border border-border',
        className
      )}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}
```

---

## Props Interface Rules

### Required vs Optional

```typescript
interface ButtonProps {
  // Required - no default needed
  children: React.ReactNode;
  
  // Optional with default - mark with ?
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  
  // Event handlers - always optional
  onClick?: () => void;
}
```

### Extending HTML Elements

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button 
      className={cn('btn', `btn-${variant}`, className)} 
      {...props} 
    />
  );
}
```

---

## Re-exports

### Component Index

```typescript
// components/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';

// Export types
export type { ButtonProps } from './Button';
```

### Package Exports

```json
// package.json
{
  "exports": {
    "./globals.css": "./src/styles/globals.css",
    "./lib/*": "./src/lib/*.ts",
    "./components/*": "./src/components/*.tsx"
  }
}
```

---

## Composition over Configuration

### Good: Composable

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Avoid: Over-configured

```tsx
<Card 
  title="Title"
  content="Content here"
  headerVariant="large"
  contentPadding="medium"
/>
```

---

## Feature Components

Feature-specific components live in the feature folder:

```
features/transfers/
├── components/
│   ├── TransferForm.tsx
│   ├── TransferForm.test.tsx
│   ├── ContactSelector.tsx
│   └── index.ts
├── hooks/
│   ├── useCreateTransfer.ts
│   └── index.ts
├── TransferPage.tsx
└── index.ts
```

---

## Forbidden Patterns

```tsx
// No default exports
export default function Button() {} // BAD
export function Button() {}         // GOOD

// No inline styles
<div style={{ padding: 16 }} />     // BAD
<div className="p-4" />             // GOOD

// No implicit children
function Card(props) {}             // BAD
function Card({ children }: CardProps) {} // GOOD

// No deeply nested components
<Outer><Middle><Inner><Deep>...</Deep></Inner></Middle></Outer> // BAD
// Extract to separate components
```
