import { z } from 'zod';

/**
 * Login form validation schema.
 */
export const loginSchema = z.object({
  username: z.string().min(1, 'Usuario requerido'),
  password: z.string().min(1, 'Contrasena requerida'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Registration form validation schema.
 */
export const registerSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z
    .string()
    .min(8, 'Minimo 8 caracteres')
    .regex(/[A-Z]/, 'Al menos una mayuscula')
    .regex(/[a-z]/, 'Al menos una minuscula')
    .regex(/[0-9]/, 'Al menos un numero'),
  confirmPassword: z.string().min(1, 'Confirme su contrasena'),
  name: z.string().min(2, 'Nombre requerido'),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contrasenas no coinciden',
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * User response validation schema.
 */
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  phone: z.string().optional(),
  avatarUrl: z.string().optional(),
  createdAt: z.string(),
  lastLoginAt: z.string().optional(),
});

/**
 * Auth response validation schema.
 */
export const authResponseSchema = z.object({
  user: userSchema,
  expiresAt: z.string(),
});
