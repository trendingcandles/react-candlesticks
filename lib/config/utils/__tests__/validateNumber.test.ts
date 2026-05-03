import { describe, expect, it } from 'vitest';
import { assertFiniteNumber, assertNonNegativeNumber, assertPositiveNumber } from '../validateNumber';

describe('validateNumber', () => {
  it('returns valid numbers', () => {
    expect(assertFiniteNumber(1.5, 'x')).toBe(1.5);
    expect(assertNonNegativeNumber(0, 'y')).toBe(0);
    expect(assertPositiveNumber(2, 'z')).toBe(2);
  });

  it('throws for invalid values', () => {
    expect(() => assertFiniteNumber(Number.NaN, 'x')).toThrow('x must be a finite number');
    expect(() => assertNonNegativeNumber(-1, 'y')).toThrow('y must be >= 0');
    expect(() => assertPositiveNumber(0, 'z')).toThrow('z must be > 0');
  });
});
