import { describe, expect, it } from 'vitest';
import deduceGranularity from '../deduceGranulairty';
import granularityToTimeUnit from '../granularityToTimeUnit';
import { DataPoint } from '../../../domain/types/DataPoint';

const dp = (ms: number): DataPoint => ({
  time: new Date(ms).toISOString(),
  open: 1,
  high: 2,
  low: 0,
  close: 1,
  volume: 10,
});

describe('data utils', () => {
  it('maps granularity to time unit', () => {
    expect(granularityToTimeUnit('m1')).toBe('minute');
    expect(granularityToTimeUnit('h1')).toBe('hour');
    expect(granularityToTimeUnit('d1')).toBe('day');
    expect(granularityToTimeUnit('w1')).toBe('week');
    expect(granularityToTimeUnit('M1')).toBe('month');
  });

  it('deduces granularity for regular intervals and sampled long series', () => {
    const base = Date.UTC(2026, 0, 1, 0, 0, 0);
    const short = Array.from({ length: 20 }, (_, i) => dp(base + i * 5 * 60_000));
    expect(deduceGranularity(short)).toBe('m5');

    const long = Array.from({ length: 320 }, (_, i) => dp(base + i * 60_000));
    expect(deduceGranularity(long)).toBe('m1');
  });

  it('throws on invalid input intervals', () => {
    expect(() => deduceGranularity([dp(1)])).toThrow('Need at least 2 data points');

    const sameTs = [dp(10), dp(10), dp(10)];
    expect(() => deduceGranularity(sameTs)).toThrow('Could not compute any valid intervals');
  });
});
