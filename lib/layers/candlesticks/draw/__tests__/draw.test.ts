import { beforeEach, describe, expect, it, vi } from 'vitest';

const drawCandlestickMock = vi.hoisted(() => vi.fn());
const drawDirectionalMarkerMock = vi.hoisted(() => vi.fn());

vi.mock('../drawCandlestick', () => ({ default: drawCandlestickMock }));
vi.mock('../../../../drawing/valueMarker/drawDirectionalValueMarker', () => ({ default: drawDirectionalMarkerMock }));

import draw from '../draw';

describe('candlesticks draw', () => {
  beforeEach(() => {
    drawCandlestickMock.mockReset();
    drawDirectionalMarkerMock.mockReset();
  });

  it('returns early when chart metrics are missing', () => {
    draw(
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      { id: 'c1', series: { body: null, wick: null }, markers: { value: null } } as never,
      {} as never,
      {
        timeScale: {
          metadata: { intervalSize: 10, scrollOffset: 0 },
          startBarIndex: 0,
          endBarIndex: 0,
          getLastVisibleBarIndex: () => 0,
        },
        dataMap: { ohlcvs: { open: new Float64Array(1), high: new Float64Array(1), low: new Float64Array(1), close: new Float64Array(1), timestamp: new Float64Array(1) } },
      } as never,
      null,
      {} as never,
      {} as never,
    );
    expect(drawCandlestickMock).not.toHaveBeenCalled();
  });

  it('draws visible candles and directional marker', () => {
    draw(
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      { series: { body: {}, wick: {} }, markers: { value: { mode: 'last-data' } }, yAxis: {}, valueLabelFormatter: (v: number) => `${v}` } as never,
      {} as never,
      {
        timeScale: {
          metadata: { intervalSize: 10, scrollOffset: 0 },
          startBarIndex: 0,
          endBarIndex: 2,
          getLastVisibleBarIndex: () => 2,
        },
        dataMap: {
          ohlcvs: {
            open: new Float64Array([1, 2, 3]),
            high: new Float64Array([3, 4, 5]),
            low: new Float64Array([0, 1, 2]),
            close: new Float64Array([2, 1, 4]),
            timestamp: new Float64Array([10, 20, 30]),
          },
        },
      } as never,
      {} as never,
      {} as never,
      { valueToY: (v: number) => v } as never,
    );

    expect(drawCandlestickMock).toHaveBeenCalledTimes(3);
    expect(drawDirectionalMarkerMock).toHaveBeenCalled();
    const direction = drawDirectionalMarkerMock.mock.calls[0][14];
    expect(direction).toBe(1);
  });
});
