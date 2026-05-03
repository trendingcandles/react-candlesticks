import { describe, expect, it } from 'vitest';
import calc from '../calc';

describe('sma calc', () => {
  it('computes average only when full period is available', () => {
    const input = new Float64Array([1, 2, 3, 4, 5]);
    const value = new Float64Array(5);
    value.fill(Number.NaN);

    calc({ period: 3 } as never, { input: { values: input } } as never, { value }, 0, 5);

    expect(Number.isNaN(value[0])).toBe(true);
    expect(Number.isNaN(value[1])).toBe(true);
    expect(value[2]).toBeCloseTo(2);
    expect(value[4]).toBeCloseTo(4);
  });

  it('skips windows containing NaN input values', () => {
    const input = new Float64Array([1, Number.NaN, 3, 4]);
    const value = new Float64Array(4);
    value.fill(Number.NaN);

    calc({ period: 2 } as never, { input: { values: input } } as never, { value }, 0, 4);

    expect(Number.isNaN(value[1])).toBe(true);
    expect(Number.isNaN(value[2])).toBe(true);
    expect(value[3]).toBeCloseTo(3.5);
  });
});
