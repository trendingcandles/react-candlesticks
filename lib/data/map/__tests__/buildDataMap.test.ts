import { describe, expect, it } from 'vitest';
import buildDataMap from '../buildDataMap';
import { DataPoint } from '../../../domain/types/DataPoint';
import { IndexBlock } from '../../../domain/types/IndexBlock';

const mkPoint = (time: string, close: number): DataPoint => ({
  time,
  open: close - 1,
  high: close + 1,
  low: close - 2,
  close,
  volume: close * 10,
});

describe('buildDataMap', () => {
  it('builds intraday map with exact timestamp matching', () => {
    const t0 = Date.UTC(2026, 0, 1, 9, 0, 0);
    const t2 = Date.UTC(2026, 0, 1, 9, 2, 0);

    const data = [
      mkPoint(new Date(t0).toISOString(), 10),
      mkPoint(new Date(t2).toISOString(), 12),
    ];

    const blocks: IndexBlock[] = [
      { session: null, startIndex: 0, startTs: t0, endTs: t2, barSizeMs: 60_000, bars: 3 },
    ];

    const map = buildDataMap(data, 'm1', blocks);
    expect(Array.from(map.dataIndexByBar)).toEqual([0, -1, 1]);
    expect(Number.isNaN(map.ohlcvs.close[1])).toBe(true);
    expect(map.ohlcvs.close[2]).toBe(12);
    expect(map.lastBarWithDataIndex).toBe(2);
  });

  it('builds calendar map by locating timestamp inside block range', () => {
    const day1 = Date.UTC(2026, 0, 1);
    const day2 = Date.UTC(2026, 0, 2);

    const data = [
      mkPoint(new Date(day1 + 10_000).toISOString(), 20),
      mkPoint(new Date(day2 + 10_000).toISOString(), 30),
      mkPoint(new Date(day2 + 99_999_999).toISOString(), 99),
    ];

    const blocks: IndexBlock[] = [
      { session: null, startIndex: 1, startTs: day2, endTs: day2 + 86_399_999, barSizeMs: 86_400_000, bars: 1, labelTs: day2 },
      { session: null, startIndex: 0, startTs: day1, endTs: day1 + 86_399_999, barSizeMs: 86_400_000, bars: 1, labelTs: day1 },
    ];

    const map = buildDataMap(data, 'd1', blocks);
    expect(Array.from(map.dataIndexByBar)).toEqual([0, 1]);
    expect(map.ohlcvs.timeLabel[0]).toBe(day1);
    expect(map.ohlcvs.timeLabel[1]).toBe(day2);
    expect(map.lastBarWithDataIndex).toBe(1);
  });
});
