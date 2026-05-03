import { describe, expect, it } from 'vitest';
import createTimeScale from '../createTimeScale';
import { DataMap } from '../../../domain/types/DataMap';

describe('createTimeScale', () => {
  const dataMap = {
    ohlcvs: {
      timestamp: [
        Date.UTC(2026, 0, 1, 10, 0),
        Date.UTC(2026, 0, 1, 10, 1),
        Date.UTC(2026, 0, 1, 10, 2),
      ],
      timeLabel: [
        Date.UTC(2026, 0, 1, 10, 0),
        Date.UTC(2026, 0, 1, 10, 1),
        Date.UTC(2026, 0, 1, 10, 2),
      ],
    },
  } as unknown as DataMap;

  it('builds time scale metadata and coordinate helpers', () => {
    const scale = createTimeScale({
      dataMap,
      granularity: 'm1',
      intervalSize: 10,
      scrollOffset: 5,
      viewportWidth: 100,
      timeZoneId: 'UTC',
      timestampToIndex: () => 7,
    });

    expect(scale.metadata.halfInterval).toBe(5);
    expect(scale.startIntervalIndex).toBe(0.5);
    expect(scale.startBarIndex).toBe(0);
    expect(scale.endBarIndex).toBe(11);
    expect(scale.xToBarIndex(0)).toBe(1);
    expect(scale.xToBarIndex(0, false)).toBe(0);
    expect(scale.xToIntervalX(12, 5)).toBe(15);
    expect(scale.getLastVisibleBarIndex(12)).toBe(11);
    expect(scale.getLastVisibleBarIndex(10)).toBe(10);
    expect(scale.timestampToIndex(1234)).toBe(7);
  });
});
