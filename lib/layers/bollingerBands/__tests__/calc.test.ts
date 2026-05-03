import { describe, expect, it } from 'vitest';
import calc from '../calc';

describe('bollinger bands calc', () => {
  it('computes middle/upper/lower bands when full period is available', () => {
    const input = new Float64Array([1, 2, 3, 4]);
    const middle = new Float64Array(4); middle.fill(Number.NaN);
    const upper = new Float64Array(4); upper.fill(Number.NaN);
    const lower = new Float64Array(4); lower.fill(Number.NaN);

    calc(
      { period: 3, standardDeviations: 2 } as never,
      { input: { values: input } } as never,
      { middle, upper, lower },
      0,
      4,
    );

    expect(middle[2]).toBeCloseTo(2);
    expect(upper[2]).toBeCloseTo(3.63299, 4);
    expect(lower[2]).toBeCloseTo(0.36700, 4);
    expect(middle[3]).toBeCloseTo(3);
  });

  it('does not emit values when lookback contains NaN', () => {
    const input = new Float64Array([1, Number.NaN, 3]);
    const middle = new Float64Array(3); middle.fill(Number.NaN);
    const upper = new Float64Array(3); upper.fill(Number.NaN);
    const lower = new Float64Array(3); lower.fill(Number.NaN);

    calc(
      { period: 3, standardDeviations: 2 } as never,
      { input: { values: input } } as never,
      { middle, upper, lower },
      0,
      3,
    );

    expect(Number.isNaN(middle[2])).toBe(true);
    expect(Number.isNaN(upper[2])).toBe(true);
    expect(Number.isNaN(lower[2])).toBe(true);
  });
});
