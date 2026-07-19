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
          metadata: { intervalSize: 10, scrollOffset: 0.25 },
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
      { valueToY: (v: number) => v + 0.25 } as never,
    );

    expect(context.beginPath).toHaveBeenCalledTimes(3);
    expect(context.stroke).toHaveBeenCalledTimes(3);
    expect(context.moveTo).toHaveBeenNthCalledWith(1, 0.5, 3.5);
    expect(context.lineTo).toHaveBeenNthCalledWith(1, 0.5, 0.5);
    expect(context.moveTo).toHaveBeenNthCalledWith(2, -3, 1.5);
    expect(context.lineTo).toHaveBeenNthCalledWith(2, 0.5, 1.5);
    expect(context.moveTo).toHaveBeenNthCalledWith(3, 0.5, 2.5);
    expect(context.lineTo).toHaveBeenNthCalledWith(3, 4, 2.5);
    expect(drawDirectionalMarkerMock).toHaveBeenCalled();
    const direction = drawDirectionalMarkerMock.mock.calls[0][14];
    expect(direction).toBe(1);
  });

  it('aligns even-width strokes to whole pixels', () => {
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
            up: { width: 0.6, backgroundColor: '#0f0', borderColor: '#0f0', borderWidth: 2 },
            down: { width: 0.6, backgroundColor: '#f00', borderColor: '#f00', borderWidth: 2 },
            flat: { width: 0.6, backgroundColor: '#999', borderColor: '#999', borderWidth: 2 },
          },
        },
        markers: { value: null },
        yAxis: {},
        valueLabelFormatter: (v: number) => `${v}`,
      } as never,
      {} as never,
      {
        timeScale: {
          metadata: { intervalSize: 10, scrollOffset: 0.25 },
          startBarIndex: 1,
          endBarIndex: 1,
          getLastVisibleBarIndex: () => 1,
        },
        dataMap: {
          ohlcvs: {
            open: new Float64Array([1, 2]),
            high: new Float64Array([3, 4]),
            low: new Float64Array([0, 1]),
            close: new Float64Array([2, 1]),
          },
        },
      } as never,
      {} as never,
      {} as never,
      { valueToY: (v: number) => v + 0.25 } as never,
    );

    expect(context.lineWidth).toBe(2);
    expect(context.moveTo).toHaveBeenNthCalledWith(1, 10, 4);
    expect(context.lineTo).toHaveBeenNthCalledWith(1, 10, 1);
    expect(context.moveTo).toHaveBeenNthCalledWith(2, 7, 2);
    expect(context.lineTo).toHaveBeenNthCalledWith(2, 10, 2);
    expect(context.moveTo).toHaveBeenNthCalledWith(3, 10, 1);
    expect(context.lineTo).toHaveBeenNthCalledWith(3, 13, 1);
  });
});
