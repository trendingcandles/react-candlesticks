import { describe, expect, it } from 'vitest';
import calc from '../calc';

describe('volumeBars calc', () => {
  it('maps volume input to output', () => {
    const volume = new Float64Array([100, 200]);
    const out: Record<string, Float64Array> = {};

    calc({} as never, { volume: { values: volume } } as never, out, 0, 2);

    expect(out.volume).toBe(volume);
  });
});
