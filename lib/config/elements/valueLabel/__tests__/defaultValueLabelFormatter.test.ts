import { describe, expect, it } from 'vitest';
import defaultValueLabelFormatter from '../defaultValueLabelFormatter';

describe('defaultValueLabelFormatter', () => {
  it('keeps two decimal places for ordinary indicator values', () => {
    expect(defaultValueLabelFormatter(0)).toBe('0.00');
    expect(defaultValueLabelFormatter(12.345)).toBe('12.35');
    expect(defaultValueLabelFormatter(-37.575)).toBe('-37.58');
  });

  it('preserves useful precision for fractional and very small values', () => {
    expect(defaultValueLabelFormatter(0.5)).toBe('0.5');
    expect(defaultValueLabelFormatter(-0.01234)).toBe('-0.0123');
    expect(defaultValueLabelFormatter(0.00001234)).toBe('1.23e-5');
  });

  it('formats large values compactly', () => {
    expect(defaultValueLabelFormatter(198_895_585)).toBe('198.9M');
    expect(defaultValueLabelFormatter(-1_250_000)).toBe('-1.25M');
    expect(defaultValueLabelFormatter(12_345_678_900)).toBe('12.35B');
  });

  it('promotes rounded values to the next suffix', () => {
    expect(defaultValueLabelFormatter(999_999_999)).toBe('1B');
    expect(defaultValueLabelFormatter(999_999_999_999)).toBe('1T');
  });

  it('returns non-finite values without throwing', () => {
    expect(defaultValueLabelFormatter(Number.NaN)).toBe('NaN');
    expect(defaultValueLabelFormatter(Number.POSITIVE_INFINITY)).toBe('Infinity');
    expect(defaultValueLabelFormatter(Number.NEGATIVE_INFINITY)).toBe('-Infinity');
  });
});
