import { describe, expect, it } from 'vitest';
import calc from '../calc';

describe('candlesticks calc', () => {
  it('maps OHLC inputs directly to outputs', () => {
    const open = new Float64Array([1, 2]);
    const high = new Float64Array([3, 4]);
    const low = new Float64Array([0, 1]);
    const close = new Float64Array([2, 3]);

    const out: Record<string, Float64Array> = {};
    calc({} as never, { open: { values: open }, high: { values: high }, low: { values: low }, close: { values: close } } as never, out, 0, 2);

    expect(out.open).toBe(open);
    expect(out.high).toBe(high);
    expect(out.low).toBe(low);
    expect(out.close).toBe(close);
  });
});
