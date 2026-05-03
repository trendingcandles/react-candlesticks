import { describe, expect, it } from 'vitest';
import continuousTimeScale from '../continuousTimeScale';
import { DataMap } from '../../../domain/types/DataMap';

describe('continuousTimeScale', () => {
  it('returns undefined index for empty series', () => {
    const emptyMap = { ohlcvs: { timestamp: [], timeLabel: [] } } as unknown as DataMap;
    const scale = continuousTimeScale(emptyMap, 'm1', 12, 0, 100);
    expect(scale.timestampToIndex(123)).toBeUndefined();
  });

  it('maps timestamp to clamped or nearest index', () => {
    const timestamps = [1000, 2000, 4000];
    const scale = continuousTimeScale(
      { ohlcvs: { timestamp: timestamps, timeLabel: timestamps } } as unknown as DataMap,
      'm1',
      12,
      0,
      100,
    );

    expect(scale.timestampToIndex(500)).toBe(0);
    expect(scale.timestampToIndex(5000)).toBe(2);
    expect(scale.timestampToIndex(2500)).toBe(2);

    expect(scale.timestampToIndex(500, true)).toBe(0);
    expect(scale.timestampToIndex(5000, true)).toBe(2);
    expect(scale.timestampToIndex(2900, true)).toBe(1);
    expect(scale.timestampToIndex(3500, true)).toBe(2);
  });
});
