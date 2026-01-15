# Component Guidelines

## Structure

### File Organization
```
ComponentName/
├── ComponentName.tsx        # Main component
├── ComponentName.test.tsx   # Tests
├── useComponentName.ts      # Component-specific hook (if needed)
└── index.ts                 # Re-export
```

### Single File (Simple Components)
```
components/
├── Button.tsx
├── Input.tsx
└── Card.tsx
```

---

## Atomic Design

### packages/ui-web Structure
```
src/components/
├── atoms/           # Basic building blocks
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Text.tsx
│   └── index.ts
├── molecules/       # Combinations of atoms
│   ├── FormField.tsx
│   ├── Card.tsx
│   ├── Alert.tsx
│   └── index.ts
└── organisms/       # Complex components
    ├── DataTable.tsx
    ├── Form.tsx
    └── index.ts
```

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
```
