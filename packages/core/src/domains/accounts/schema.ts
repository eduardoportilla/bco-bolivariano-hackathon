import { z } from 'zod';

/**
 * Account response validation schema.
 */
export const accountSchema = z.object({
  id: z.string(),
  name: z.string(),
  number: z.string(),
  type: z.enum(['checking', 'savings']),
  balance: z.number(),
  availableBalance: z.number(),
  currency: z.enum(['USD', 'EUR']),
  isPrimary: z.boolean(),
  createdAt: z.string(),
});

/**
 * Accounts list response validation schema.
 */
export const accountsResponseSchema = z.object({
  accounts: z.array(accountSchema),
});

/**
 * Account balance response validation schema.
 */
export const accountBalanceSchema = z.object({
  accountId: z.string(),
  balance: z.number(),
  availableBalance: z.number(),
  lastUpdated: z.string(),
});

/**
 * Transaction validation schema.
 */
export const transactionSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  type: z.enum(['credit', 'debit']),
  amount: z.number(),
  description: z.string(),
  reference: z.string().optional(),
  createdAt: z.string(),
});

/**
 * Transactions list response validation schema.
 */
export const transactionsResponseSchema = z.object({
  transactions: z.array(transactionSchema),
  total: z.number(),
});
