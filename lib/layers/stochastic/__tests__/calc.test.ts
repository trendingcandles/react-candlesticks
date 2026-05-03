import { describe, expect, it } from 'vitest';
import calc from '../calc';

describe('stochastic calc', () => {
  it('computes k, smoothed k and d values', () => {
    const high = new Float64Array([1, 2, 3, 4, 5]);
    const low = new Float64Array([0, 1, 2, 3, 4]);
    const close = new Float64Array([0.5, 1.5, 2.5, 3.5, 4.5]);

    const k = new Float64Array(5); k.fill(Number.NaN);
    const kSmoothed = new Float64Array(5); kSmoothed.fill(Number.NaN);
    const d = new Float64Array(5); d.fill(Number.NaN);

    calc({ period: 3, kSmoothing: 2, dPeriod: 2 } as never, { high: { values: high }, low: { values: low }, close: { values: close } } as never, { k, kSmoothed, d }, 0, 5);

    expect(k[2]).toBeCloseTo(83.333, 2);
    expect(kSmoothed[3]).toBeCloseTo(83.333, 2);
    expect(d[4]).toBeCloseTo(83.333, 2);
  });

  it('does not emit raw K when high and low range is zero', () => {
    const flat = new Float64Array([1, 1, 1]);
    const close = new Float64Array([1, 1, 1]);

    const k = new Float64Array(3); k.fill(Number.NaN);
    const kSmoothed = new Float64Array(3); kSmoothed.fill(Number.NaN);
    const d = new Float64Array(3); d.fill(Number.NaN);

    calc({ period: 2, kSmoothing: 2, dPeriod: 2 } as never, { high: { values: flat }, low: { values: flat }, close: { values: close } } as never, { k, kSmoothed, d }, 0, 3);

    expect(Number.isNaN(k[1])).toBe(true);
    expect(Number.isNaN(kSmoothed[2])).toBe(true);
    expect(Number.isNaN(d[2])).toBe(true);
  });
});
