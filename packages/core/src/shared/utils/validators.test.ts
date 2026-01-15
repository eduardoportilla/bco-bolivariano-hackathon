import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidPhone,
  isValidAccountNumber,
  isValidTransferAmount,
  validatePassword,
} from './validators';

describe('isValidEmail', () => {
  it('should return true for valid email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
  });

  it('should return false for invalid email', () => {
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('test@')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
  });
});

describe('isValidPhone', () => {
  it('should return true for valid Ecuador phone', () => {
    expect(isValidPhone('0991234567')).toBe(true);
  });

  it('should return false for invalid phone', () => {
    expect(isValidPhone('1234567890')).toBe(false);
    expect(isValidPhone('099123')).toBe(false);
  });

  it('should handle formatted phone numbers', () => {
    expect(isValidPhone('099-123-4567')).toBe(true);
  });
});

describe('isValidAccountNumber', () => {
  it('should return true for valid account number', () => {
    expect(isValidAccountNumber('1234567890')).toBe(true);
    expect(isValidAccountNumber('12345678901234567890')).toBe(true);
  });

  it('should return false for too short account number', () => {
    expect(isValidAccountNumber('123456789')).toBe(false);
  });

  it('should return false for too long account number', () => {
    expect(isValidAccountNumber('123456789012345678901')).toBe(false);
  });
});

describe('isValidTransferAmount', () => {
  it('should return valid for acceptable amount', () => {
    const result = isValidTransferAmount(100, 1000, 500);
    expect(result.valid).toBe(true);
  });

  it('should return error for zero or negative amount', () => {
    const result = isValidTransferAmount(0, 1000, 500);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('El monto debe ser mayor a 0');
  });

  it('should return error for insufficient funds', () => {
    const result = isValidTransferAmount(500, 100, 1000);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Fondos insuficientes');
  });

  it('should return error for exceeding limit', () => {
    const result = isValidTransferAmount(600, 1000, 500);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('excede el limite');
  });
});

describe('validatePassword', () => {
  it('should return valid for strong password', () => {
    const result = validatePassword('Password123');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return errors for weak password', () => {
    const result = validatePassword('weak');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Minimo 8 caracteres');
    expect(result.errors).toContain('Al menos una mayuscula');
    expect(result.errors).toContain('Al menos un numero');
  });

  it('should detect missing uppercase', () => {
    const result = validatePassword('password123');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Al menos una mayuscula');
  });

  it('should detect missing lowercase', () => {
    const result = validatePassword('PASSWORD123');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Al menos una minuscula');
  });

  it('should detect missing number', () => {
    const result = validatePassword('PasswordOnly');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Al menos un numero');
  });
});
