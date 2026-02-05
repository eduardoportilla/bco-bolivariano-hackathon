import { describe, it, expect } from 'vitest';
import { getRouterBasename } from './routing';

describe('getRouterBasename', () => {
  it('should strip trailing slash from subpath', () => {
    expect(getRouterBasename('/_mfe/accounts/')).toBe('/_mfe/accounts');
  });

  it('should strip multiple trailing slashes', () => {
    expect(getRouterBasename('/_mfe/accounts///')).toBe('/_mfe/accounts');
  });

  it('should return empty string for root path', () => {
    expect(getRouterBasename('/')).toBe('');
  });

  it('should return empty string for empty string', () => {
    expect(getRouterBasename('')).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(getRouterBasename(undefined)).toBe('');
  });

  it('should preserve path without trailing slash', () => {
    expect(getRouterBasename('/_mfe/accounts')).toBe('/_mfe/accounts');
  });

  it('should handle nested subpaths', () => {
    expect(getRouterBasename('/_mfe/transfers/v2/')).toBe('/_mfe/transfers/v2');
  });
});
