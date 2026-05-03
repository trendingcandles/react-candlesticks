import { describe, expect, it } from 'vitest';
import createContinuousIndexProvider from '../createContinuousIndexProvider';
import { DataPoint } from '../../../domain/types/DataPoint';

const mkPoint = (timeMs: number, close: number): DataPoint => ({
  time: new Date(timeMs).toISOString(),
  open: close - 1,
  high: close + 1,
  low: close - 2,
  close,
  volume: close * 10,
});

describe('createContinuousIndexProvider', () => {
  it('returns an empty provider for empty data', () => {
    const provider = createContinuousIndexProvider([], 'm1');

    expect(provider.barsLength).toBe(0);
    expect(provider.firstDataPointIndex).toBeUndefined();
    expect(provider.lastDataPointIndex).toBeUndefined();
    expect(provider.indexToTimestamp(0)).toBeUndefined();
    expect(provider.findClosestIndex(Date.UTC(2026, 0, 1))).toBe(0);

    const scale = provider.getTimescale(12, 0, 120);
    expect(scale.metadata.granularity).toBe('m1');
    expect(scale.gridLines).toEqual([]);
  });

  it('builds provider methods for continuous bars', () => {
    const base = Date.UTC(2026, 0, 1, 9, 0, 0);
    const data = [mkPoint(base, 10), mkPoint(base + 60_000, 20), mkPoint(base + 120_000, 30)];
    const provider = createContinuousIndexProvider(data, 'm1');

    expect(provider.barsLength).toBe(3);
    expect(provider.firstDataPointIndex).toBe(0);
    expect(provider.lastDataPointIndex).toBe(2);

    expect(provider.indexToTimestamp(1)).toBe(base + 60_000);
    expect(provider.findClosestIndex(base + 90_000)).toBe(1);

    const scale = provider.getTimescale(12, 6, 120);
    expect(scale.metadata.granularity).toBe('m1');
    expect(scale.metadata.intervalSize).toBe(12);
    expect(scale.timestampToIndex(base + 60_000)).toBe(1);
  });
});
