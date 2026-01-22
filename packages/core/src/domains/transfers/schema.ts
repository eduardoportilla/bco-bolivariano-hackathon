import { z } from 'zod';

/**
 * Transfer form validation schema.
 */
export const transferSchema = z.object({
  fromAccountId: z.string().min(1, 'Seleccione cuenta origen'),
  toAccountId: z.string().min(1, 'Seleccione cuenta destino'),
  amount: z
    .number({ error: 'Ingrese un monto valido' })
    .positive('El monto debe ser mayor a 0')
    .max(10000, 'Monto maximo $10,000'),
  description: z.string().max(100, 'Maximo 100 caracteres').optional(),
});

export type TransferFormData = z.infer<typeof transferSchema>;

/**
 * Create contact form validation schema.
 */
export const createContactSchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  accountNumber: z
    .string()
    .min(10, 'Numero de cuenta invalido')
    .max(20, 'Numero de cuenta invalido')
    .regex(/^\d+$/, 'Solo numeros permitidos'),
  accountType: z.enum(['checking', 'savings'], {
    error: 'Seleccione tipo de cuenta',
  }),
  bank: z.string().min(1, 'Seleccione banco'),
  bankCode: z.string().optional(),
});

export type CreateContactFormData = z.infer<typeof createContactSchema>;

/**
 * Transfer response validation schema.
 */
export const transferResponseSchema = z.object({
  id: z.string(),
  fromAccountId: z.string(),
  fromAccountNumber: z.string(),
  toAccountId: z.string(),
  toAccountNumber: z.string(),
  toBeneficiaryName: z.string(),
  toBankName: z.string().optional(),
  amount: z.number(),
  currency: z.string(),
  description: z.string().optional(),
  reference: z.string(),
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled']),
  createdAt: z.string(),
  completedAt: z.string().optional(),
});

/**
 * Contact response validation schema.
 */
export const contactSchema = z.object({
  id: z.string(),
  name: z.string(),
  accountNumber: z.string(),
  accountType: z.enum(['checking', 'savings']),
  bank: z.string(),
  bankCode: z.string().optional(),
  isFavorite: z.boolean(),
  createdAt: z.string(),
});
