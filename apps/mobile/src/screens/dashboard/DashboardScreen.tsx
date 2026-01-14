import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button } from '../../components/ui';
import { colors, spacing, typography } from '../../constants';

export function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hola, Usuario</Text>
          <Text style={styles.date}>13 de enero, 2026</Text>
        </View>

        <Card style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo disponible</Text>
          <Text style={styles.balanceAmount}>$12,450.00</Text>
          <Text style={styles.accountNumber}>Cuenta **** 4532</Text>
        </Card>

        <Text style={styles.sectionTitle}>Acciones rapidas</Text>
        <View style={styles.actionsGrid}>
          <Card style={styles.actionCard}>
            <Text style={styles.actionTitle}>Transferir</Text>
          </Card>
          <Card style={styles.actionCard}>
            <Text style={styles.actionTitle}>Pagar</Text>
          </Card>
          <Card style={styles.actionCard}>
            <Text style={styles.actionTitle}>Recargar</Text>
          </Card>
          <Card style={styles.actionCard}>
            <Text style={styles.actionTitle}>Historial</Text>
          </Card>
        </View>

        <Text style={styles.sectionTitle}>Ultimos movimientos</Text>
        <Card>
          <View style={styles.transaction}>
            <View>
              <Text style={styles.transactionTitle}>Pago de luz</Text>
              <Text style={styles.transactionDate}>Hoy, 10:30 AM</Text>
            </View>
            <Text style={styles.transactionAmount}>-$45.00</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.transaction}>
            <View>
              <Text style={styles.transactionTitle}>Deposito</Text>
              <Text style={styles.transactionDate}>Ayer, 3:15 PM</Text>
            </View>
            <Text style={[styles.transactionAmount, styles.income]}>+$500.00</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  date: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  balanceCard: {
    backgroundColor: colors.primary,
    marginBottom: spacing.lg,
  },
  balanceLabel: {
    fontSize: typography.sizes.sm,
    color: colors.white,
    opacity: 0.8,
  },
  balanceAmount: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.white,
    marginVertical: spacing.xs,
  },
  accountNumber: {
    fontSize: typography.sizes.sm,
    color: colors.white,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actionCard: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  actionTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  transactionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  transactionDate: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  transactionAmount: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.error,
  },
  income: {
    color: colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});
