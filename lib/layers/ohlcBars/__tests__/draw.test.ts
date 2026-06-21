import { beforeEach, describe, expect, it, vi } from 'vitest';

const drawDirectionalMarkerMock = vi.hoisted(() => vi.fn());

vi.mock('../../../drawing/valueMarker/drawDirectionalValueMarker', () => ({ default: drawDirectionalMarkerMock }));

import draw from '../draw';

describe('ohlc bars draw', () => {
  beforeEach(() => {
    drawDirectionalMarkerMock.mockReset();
  });

  it('returns early when chart metrics are missing', () => {
    const context = { beginPath: vi.fn(), stroke: vi.fn() };

    draw(
      context as never,
      {} as never,
      {} as never,
      {} as never,
      { series: { bars: null }, markers: { value: null } } as never,
      {} as never,
      {} as never,
      null,
      {} as never,
      {} as never,
    );

    expect(context.beginPath).not.toHaveBeenCalled();
  });

  it('draws visible bars and directional marker', () => {
    const context = {
      save: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      strokeStyle: '',
      lineWidth: 1,
    };

    draw(
      context as never,
      {} as never,
      {} as never,
      {} as never,
      {
        series: {
          bars: {
            up: { width: 0.6, backgroundColor: '#0f0', borderColor: '#0f0', borderWidth: 1 },
            down: { width: 0.6, backgroundColor: '#f00', borderColor: '#f00', borderWidth: 1 },
            flat: { width: 0.6, backgroundColor: '#999', borderColor: '#999', borderWidth: 1 },
          },
        },
        markers: { value: { mode: 'last-data' } },
        yAxis: {},
        valueLabelFormatter: (v: number) => `${v}`,
      } as never,
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
          },
        },
      } as never,
      {} as never,
      {} as never,
      { valueToY: (v: number) => v } as never,
    );

    expect(context.beginPath).toHaveBeenCalledTimes(3);
    expect(context.stroke).toHaveBeenCalledTimes(3);
    expect(drawDirectionalMarkerMock).toHaveBeenCalled();
    const direction = drawDirectionalMarkerMock.mock.calls[0][14];
    expect(direction).toBe(1);
  });
});
