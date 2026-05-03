import { describe, expect, it } from 'vitest';
import calc from '../calc';

describe('ema calc', () => {
  it('seeds EMA with SMA and then applies EMA smoothing', () => {
    const input = new Float64Array([1, 2, 3, 4, 5]);
    const value = new Float64Array(5);
    value.fill(Number.NaN);

    calc({ period: 3 } as never, { input: { values: input } } as never, { value }, 0, 5);

    expect(value[2]).toBeCloseTo(2); // initial SMA of [1,2,3]
    expect(value[3]).toBeCloseTo(3); // ((4 * .5) + (2 * .5))
    expect(value[4]).toBeCloseTo(4); // ((5 * .5) + (3 * .5))
  });

  it('skips NaN input values', () => {
    const input = new Float64Array([1, 2, Number.NaN, 4]);
    const value = new Float64Array(4);
    value.fill(Number.NaN);

    calc({ period: 2 } as never, { input: { values: input } } as never, { value }, 0, 4);

    expect(value[1]).toBeCloseTo(1.5);
    expect(Number.isNaN(value[2])).toBe(true);
  });
});
