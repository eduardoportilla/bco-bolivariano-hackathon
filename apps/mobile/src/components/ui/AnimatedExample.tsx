/**
 * EJEMPLO DE ANIMACION CON REANIMATED
 *
 * Este componente es solo para demostrar react-native-reanimated.
 * Puede eliminarse sin afectar ninguna otra parte de la app.
 *
 * REQUISITOS:
 * 1. Instalar: pnpm add react-native-reanimated react-native-worklets --filter mobile
 * 2. Agregar plugin en babel.config.js: plugins: ['react-native-reanimated/plugin']
 * 3. Rebuild nativo: cd android && ./gradlew clean && cd .. && pnpm run android
 */
import React, { useEffect } from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { colors, spacing, typography } from '../../constants';

interface AnimatedExampleProps {
  onRemove?: () => void;
}

export function AnimatedExample({ onRemove }: AnimatedExampleProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Animacion de pulso continuo
    scale.value = withRepeat(
      withSequence(
        withSpring(1.1, { damping: 2 }),
        withSpring(1, { damping: 2 })
      ),
      -1, // Repetir infinitamente
      true
    );
  }, [scale]);

  function handlePress() {
    // Animacion al presionar
    rotation.value = withSequence(
      withSpring(10),
      withSpring(-10),
      withSpring(0)
    );
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable onPress={handlePress} style={styles.content}>
        <Text style={styles.emoji}>✨</Text>
        <Text style={styles.title}>Reanimated Funciona!</Text>
        <Text style={styles.subtitle}>Toca para animar</Text>
      </Pressable>
      {onRemove && (
        <Pressable onPress={onRemove} style={styles.removeButton}>
          <Text style={styles.removeText}>Eliminar ejemplo</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    margin: spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  removeButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  removeText: {
    fontSize: typography.sizes.xs,
    color: colors.error,
  },
});
