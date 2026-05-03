import { describe, expect, it } from 'vitest';
import lowerBound from '../lowerBound';
import getKnownBars from '../getKnownBars';
import indexToTimestamp from '../indexToTimestamp';
import findClosestIndex from '../findClosestIndex';
import timestampToBarIndex from '../timestampToBarIndex';
import { DataMap } from '../../../domain/types/DataMap';

const makeDataMap = (timestamps: number[]): DataMap => ({
  granularity: 'm1',
  rawData: [],
  dataIndexByBar: new Int32Array(timestamps.length),
  ohlcvs: {
    timestamp: Float64Array.from(timestamps),
    timeLabel: Float64Array.from(timestamps),
    open: new Float64Array(timestamps.length),
    high: new Float64Array(timestamps.length),
    low: new Float64Array(timestamps.length),
    close: new Float64Array(timestamps.length),
    volume: new Float64Array(timestamps.length),
  },
});

describe('index provider search helpers', () => {
  it('computes lowerBound positions', () => {
    const arr = [10, 20, 20, 40];
    expect(lowerBound(arr, 5)).toBe(0);
    expect(lowerBound(arr, 20)).toBe(1);
    expect(lowerBound(arr, 21)).toBe(3);
    expect(lowerBound(arr, 100)).toBe(4);
  });

  it('collects known bars and maps index to timestamp', () => {
    const map = makeDataMap([1000, Number.NaN, 3000, 4000]);
    expect(getKnownBars(map)).toEqual({ bars: [0, 2, 3], ts: [1000, 3000, 4000] });

    expect(indexToTimestamp(2.4, map)).toBe(3000);
    expect(indexToTimestamp(1, map)).toBeUndefined();
    expect(indexToTimestamp(-1, map)).toBeUndefined();
    expect(indexToTimestamp(99, map)).toBeUndefined();
  });

  it('finds closest index and timestamp-to-bar lookup', () => {
    const map = makeDataMap([1000, 2000, 4000, 8000]);
    expect(findClosestIndex(500, map)).toBe(0);
    expect(findClosestIndex(9000, map)).toBe(3);
    expect(findClosestIndex(3000, map)).toBe(1);
    expect(findClosestIndex(3500, map)).toBe(2);

    const mapWithGaps = makeDataMap([1000, Number.NaN, 3000, 7000]);
    expect(timestampToBarIndex(500, mapWithGaps)).toBe(0);
    expect(timestampToBarIndex(9000, mapWithGaps)).toBe(3);
    expect(timestampToBarIndex(2000, mapWithGaps, false)).toBe(2);
    expect(timestampToBarIndex(2000, mapWithGaps, true)).toBe(0);

    const empty = makeDataMap([]);
    expect(timestampToBarIndex(1, empty)).toBeUndefined();
  });
});
