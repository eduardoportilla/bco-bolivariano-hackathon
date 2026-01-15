# Styling Guidelines

## Web: TailwindCSS 4.1 + shadcn/ui

### Architecture

```
packages/ui-web/
├── src/
│   ├── styles/
│   │   └── globals.css      # @import "tailwindcss" + theme vars
│   ├── lib/
│   │   └── utils.ts         # cn() helper
│   └── components/          # shadcn components
├── components.json          # shadcn config
└── package.json
```

### TailwindCSS 4.1 Setup

CSS-first configuration in `globals.css`:

```css
@import "tailwindcss";

@theme inline {
  --color-primary: var(--primary);
  --color-secondary: var(--secondary);
  --radius-lg: var(--radius);
}

:root {
  --primary: oklch(0.205 0 0);
  --secondary: oklch(0.97 0 0);
  --radius: 0.625rem;
}

.dark {
  --primary: oklch(0.985 0 0);
  --secondary: oklch(0.269 0 0);
}
```

### Vite Configuration

```typescript
// vite.config.ts
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
});
```

### cn() Utility

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## Component Styling

### Use Tailwind Utilities
```tsx
// Good: Tailwind classes
<button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
  Click me
</button>

// Bad: Inline styles
<button style={{ backgroundColor: 'blue', padding: '8px 16px' }}>
  Click me
</button>
```

### Use cn() for Conditional Classes
```tsx
<button 
  className={cn(
    'px-4 py-2 rounded-lg',
    variant === 'primary' && 'bg-primary text-primary-foreground',
    variant === 'secondary' && 'bg-secondary text-secondary-foreground',
    disabled && 'opacity-50 cursor-not-allowed'
  )}
>
  {children}
</button>
```

---

## Microfrontend Style Isolation

### Rules
- Use only Tailwind utility classes
- No global CSS selectors
- No conflicting `@layer` definitions across MFEs
- Design tokens from shared `@repo/ui` package

### Importing Shared Styles

```css
/* In each app's main CSS */
@import "@repo/ui/globals.css";

/* App-specific additions only */
```

---

## Mobile: Native StyleSheet

React Native uses native `StyleSheet`, not NativeWind:

```typescript
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});

export function Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello</Text>
    </View>
  );
}
```

---

## Design Tokens

Shared between web and mobile through consistent naming:

| Token | Web (CSS) | Mobile (JS) |
|-------|-----------|-------------|
| Primary | `--color-primary` | `colors.primary` |
| Background | `--color-background` | `colors.background` |
| Radius | `--radius-lg` | `spacing.radiusLg` |
