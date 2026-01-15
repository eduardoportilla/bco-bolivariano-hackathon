/**
 * Error codes returned by the API.
 */
export const ERROR_CODES = {
  // Auth errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',

  // Transfer errors
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  INVALID_ACCOUNT: 'INVALID_ACCOUNT',
  DAILY_LIMIT_EXCEEDED: 'DAILY_LIMIT_EXCEEDED',
  TRANSFER_LIMIT_EXCEEDED: 'TRANSFER_LIMIT_EXCEEDED',
  SAME_ACCOUNT: 'SAME_ACCOUNT',

  // General errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/**
 * User-friendly error messages in Spanish.
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ERROR_CODES.INVALID_CREDENTIALS]: 'Credenciales invalidas',
  [ERROR_CODES.SESSION_EXPIRED]: 'Sesion expirada, por favor inicie sesion nuevamente',
  [ERROR_CODES.UNAUTHORIZED]: 'No tiene permisos para realizar esta accion',
  [ERROR_CODES.ACCOUNT_LOCKED]: 'Cuenta bloqueada, contacte a soporte',
  [ERROR_CODES.INSUFFICIENT_FUNDS]: 'Fondos insuficientes',
  [ERROR_CODES.INVALID_ACCOUNT]: 'Cuenta invalida',
  [ERROR_CODES.DAILY_LIMIT_EXCEEDED]: 'Limite diario excedido',
  [ERROR_CODES.TRANSFER_LIMIT_EXCEEDED]: 'Monto excede el limite por transferencia',
  [ERROR_CODES.SAME_ACCOUNT]: 'No puede transferir a la misma cuenta',
  [ERROR_CODES.VALIDATION_ERROR]: 'Error de validacion',
  [ERROR_CODES.NOT_FOUND]: 'Recurso no encontrado',
  [ERROR_CODES.SERVER_ERROR]: 'Error del servidor, intente mas tarde',
  [ERROR_CODES.NETWORK_ERROR]: 'Error de conexion, verifique su internet',
};

/**
 * Get user-friendly error message for an error code.
 */
export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code as ErrorCode] ?? ERROR_MESSAGES[ERROR_CODES.SERVER_ERROR];
}
