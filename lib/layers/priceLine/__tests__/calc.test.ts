import { describe, expect, it } from 'vitest';
import calc from '../calc';

describe('priceLine calc', () => {
  it('maps input series to price output', () => {
    const input = new Float64Array([10, 20, 30]);
    const out: Record<string, Float64Array> = {};

    calc({} as never, { input: { values: input } } as never, out, 0, 3);

    expect(out.price).toBe(input);
  });
});
