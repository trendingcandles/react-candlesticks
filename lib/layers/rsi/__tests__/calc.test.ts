import { describe, expect, it } from 'vitest';
import calc from '../calc';

describe('rsi calc', () => {
  it('computes RSI once full period is available', () => {
    const input = new Float64Array([1, 2, 3, 2, 1, 2]);
    const value = new Float64Array(6);
    value.fill(Number.NaN);

    calc({ period: 3 } as never, { input: { values: input } } as never, { value }, 0, 6);

    expect(Number.isNaN(value[2])).toBe(true);
    expect(value[3]).toBeCloseTo(66.66, 1);
    expect(value[4]).toBeCloseTo(44.44, 1);
    expect(value[5]).toBeCloseTo(62.96, 1);
  });

  it('emits 100 when there are gains but no losses', () => {
    const input = new Float64Array([1, 2, 3, 4]);
    const value = new Float64Array(4);
    value.fill(Number.NaN);

    calc({ period: 2 } as never, { input: { values: input } } as never, { value }, 0, 4);

    expect(value[2]).toBe(100);
    expect(value[3]).toBe(100);
  });
});
