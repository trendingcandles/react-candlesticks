import { describe, expect, it } from 'vitest';
import calc from '../calc';

describe('atr calc', () => {
  it('computes initial ATR from period true ranges and smooths subsequent values', () => {
    const high = new Float64Array([12, 13, 14, 15]);
    const low = new Float64Array([10, 11, 12, 13]);
    const close = new Float64Array([11, 12, 13, 14]);
    const value = new Float64Array(4);
    value.fill(Number.NaN);

    calc({ period: 2 } as never, { high: { values: high }, low: { values: low }, close: { values: close } } as never, { value }, 0, 4);

    expect(value[1]).toBeCloseTo(2);
    expect(value[2]).toBeCloseTo(2);
    expect(value[3]).toBeCloseTo(2);
  });

  it('uses high-low range when previous close is NaN', () => {
    const high = new Float64Array([12, 15]);
    const low = new Float64Array([10, 11]);
    const close = new Float64Array([Number.NaN, 12]);
    const value = new Float64Array(2);
    value.fill(Number.NaN);

    calc({ period: 1 } as never, { high: { values: high }, low: { values: low }, close: { values: close } } as never, { value }, 0, 2);

    expect(value[1]).toBeCloseTo(4);
  });
});
