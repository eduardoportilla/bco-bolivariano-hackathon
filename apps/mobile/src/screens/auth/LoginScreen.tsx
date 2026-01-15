import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, Card } from '../../components/ui';
import { colors, spacing, typography } from '../../constants';
import { User } from '../../components/icons';

// EJEMPLO REANIMATED: Descomentar despues de rebuild nativo
import { AnimatedExample } from '../../components/ui/AnimatedExample';

interface LoginFormData {
  username: string;
  password: string;
}

export function LoginScreen() {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showExample, setShowExample] = useState(true);

  async function handleLogin() {
    setIsLoading(true);
    // Simulate login
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));
    setIsLoading(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* EJEMPLO REANIMATED: Descomentar despues de rebuild nativo */}
          showExample && (
            <AnimatedExample onRemove={() => setShowExample(false)} />
          )

          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <User size={48} color={colors.primary} />
            </View>
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>
              Ingresa tus credenciales para acceder
            </Text>
          </View>

          <Card style={styles.card}>
            <Input
              label="Usuario"
              placeholder="Ingresa tu usuario"
              value={formData.username}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, username: text }))
              }
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Input
              label="Contrasena"
              placeholder="Ingresa tu contrasena"
              value={formData.password}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, password: text }))
              }
              secureTextEntry
            />

            <Button
              title="Ingresar"
              onPress={handleLogin}
              loading={isLoading}
              size="lg"
            />

            <Button
              title="Olvidaste tu contrasena?"
              variant="ghost"
              onPress={() => {}}
              style={styles.forgotButton}
            />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    padding: spacing.lg,
  },
  forgotButton: {
    marginTop: spacing.md,
  },
});
