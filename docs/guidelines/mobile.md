# Mobile Guidelines

React Native CLI (not Expo) for iOS and Android.

---

## Project Structure

Components are colocated in the mobile app (no separate ui-mobile package):

```
apps/mobile/
├── src/
│   ├── app/
│   │   └── App.tsx
│   ├── components/
│   │   ├── ui/               # Reusable UI: Button, Input, Card
│   │   └── common/           # App-level shared components
│   ├── features/
│   │   └── [name]/
│   │       ├── screens/
│   │       ├── components/   # Feature-specific components
│   │       ├── hooks/
│   │       ├── services/
│   │       └── index.ts
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.ts     # Axios instance
│   │   │   └── interceptors.ts
│   │   └── security/
│   │       └── secureStorage.ts
│   ├── store/
│   │   └── auth.store.ts
│   ├── navigation/
│   ├── hooks/                # Shared hooks
│   ├── utils/
│   └── constants/
├── android/
├── ios/
└── index.js
```

> **Note:** UI components live in `src/components/ui/` rather than a separate package since there is only one mobile app.

---

## Navigation (React Navigation)

```typescript
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  AccountDetail: { accountId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

---

## Styling (Native StyleSheet)

```typescript
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { colors, spacing, typography } from '@/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.radiusMd,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
});
```

---

## Design Tokens

```typescript
// constants/colors.ts
export const colors = {
  primary: '#0047AB',
  secondary: '#00A19A',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  border: '#E5E5E5',
  error: '#DC2626',
  success: '#16A34A',
  white: '#FFFFFF',
};

// constants/spacing.ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  radiusSm: 4,
  radiusMd: 8,
  radiusLg: 12,
};

// constants/typography.ts
export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};
```

---

## Components

```typescript
import { Pressable, Text, StyleSheet, PressableProps } from 'react-native';
import { colors, spacing, typography } from '@/constants';

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary';
}

export function Button({ title, variant = 'primary', style, ...props }: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' && styles.secondary,
        pressed && styles.pressed,
        style,
      ]}
      {...props}
    >
      <Text style={[styles.text, variant === 'secondary' && styles.textSecondary]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.radiusMd,
    alignItems: 'center',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  textSecondary: {
    color: colors.primary,
  },
});
```

---

## Icons

Import icons from the curated set to maintain design consistency:

```typescript
// Good: Import from curated set
import { User, Settings, ChevronRight } from '@/components/icons';

// Bad: Import directly from lucide-react-native
import { User } from 'lucide-react-native'; // DON'T do this
```

To add a new icon, update `apps/mobile/src/components/icons.ts`:

```typescript
// apps/mobile/src/components/icons.ts
export {
  // Add new icons here
  NewIcon,
  // ... existing icons
} from 'lucide-react-native';
```

---

## Performance Rules

1. Use `FlatList` for lists, never `ScrollView` + `map`
2. Memoize expensive computations with `useMemo`
3. Wrap callbacks with `useCallback`
4. Avoid inline styles in render
5. Use `React.memo` for pure components
6. Profile with Flipper

---

## Platform-Specific Code

```typescript
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
  }),
});
```

---

## Secure Storage

```typescript
import * as Keychain from 'react-native-keychain';

export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    await Keychain.setGenericPassword(key, value, { service: key });
  },
  
  async getItem(key: string): Promise<string | null> {
    const result = await Keychain.getGenericPassword({ service: key });
    return result ? result.password : null;
  },
  
  async removeItem(key: string): Promise<void> {
    await Keychain.resetGenericPassword({ service: key });
  },
};
```
