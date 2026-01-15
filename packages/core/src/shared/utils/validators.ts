/**
 * Validate email format.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format (Ecuador).
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 && cleaned.startsWith('09');
}

/**
 * Validate account number format.
 */
export function isValidAccountNumber(accountNumber: string): boolean {
  const cleaned = accountNumber.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 20;
}

/**
 * Validate transfer amount.
 */
export function isValidTransferAmount(amount: number, balance: number, maxLimit: number): {
  valid: boolean;
  error?: string;
} {
  if (amount <= 0) {
    return { valid: false, error: 'El monto debe ser mayor a 0' };
  }
  if (amount > balance) {
    return { valid: false, error: 'Fondos insuficientes' };
  }
  if (amount > maxLimit) {
    return { valid: false, error: `Monto excede el limite de ${maxLimit}` };
  }
  return { valid: true };
}

/**
 * Validate password strength.
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Minimo 8 caracteres');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Al menos una mayuscula');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Al menos una minuscula');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Al menos un numero');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
