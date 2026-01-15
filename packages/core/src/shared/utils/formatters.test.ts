import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatDate,
  formatRelativeTime,
  maskAccountNumber,
  formatPhoneNumber,
} from './formatters';

describe('formatCurrency', () => {
  it('should format USD amounts correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('should format zero amounts', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should format negative amounts', () => {
    expect(formatCurrency(-100)).toBe('-$100.00');
  });

  it('should handle large amounts', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000.00');
  });
});

describe('formatDate', () => {
  it('should format date in short style', () => {
    const result = formatDate('2024-06-15T10:30:00Z', 'short');
    expect(result).toContain('2024');
  });

  it('should format date in long style', () => {
    const result = formatDate('2024-06-15T10:30:00Z', 'long');
    expect(result).toContain('2024');
  });

  it('should handle Date objects', () => {
    const date = new Date('2024-06-15T10:30:00Z');
    const result = formatDate(date, 'short');
    expect(result).toContain('2024');
  });
});

describe('formatRelativeTime', () => {
  it('should return "ahora" for very recent times', () => {
    const now = new Date();
    expect(formatRelativeTime(now)).toBe('ahora');
  });

  it('should format minutes ago', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatRelativeTime(date)).toBe('hace 5 minutos');
  });

  it('should format single minute', () => {
    const date = new Date(Date.now() - 1 * 60 * 1000);
    expect(formatRelativeTime(date)).toBe('hace 1 minuto');
  });

  it('should format hours ago', () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000);
    expect(formatRelativeTime(date)).toBe('hace 3 horas');
  });

  it('should format days ago', () => {
    const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(date)).toBe('hace 2 dias');
  });
});

describe('maskAccountNumber', () => {
  it('should mask account number showing last 4 digits', () => {
    expect(maskAccountNumber('1234567890')).toBe('****7890');
  });

  it('should handle short account numbers', () => {
    expect(maskAccountNumber('1234')).toBe('1234');
  });

  it('should handle very short account numbers', () => {
    expect(maskAccountNumber('12')).toBe('12');
  });
});

describe('formatPhoneNumber', () => {
  it('should format 10-digit phone number', () => {
    expect(formatPhoneNumber('0991234567')).toBe('(099) 123-4567');
  });

  it('should return original if not 10 digits', () => {
    expect(formatPhoneNumber('12345')).toBe('12345');
  });

  it('should handle phone with existing formatting', () => {
    expect(formatPhoneNumber('099-123-4567')).toBe('(099) 123-4567');
  });
});
