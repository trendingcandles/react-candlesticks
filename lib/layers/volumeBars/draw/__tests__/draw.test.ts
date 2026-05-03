import { beforeEach, describe, expect, it, vi } from 'vitest';

const drawVolumeBarMock = vi.hoisted(() => vi.fn());
const markerMock = vi.hoisted(() => vi.fn());

vi.mock('../drawVolumeBar', () => ({ default: drawVolumeBarMock }));
vi.mock('../../../../drawing/valueMarker/drawValueMarker', () => ({ default: markerMock }));

import draw from '../draw';

describe('volume bars draw', () => {
  beforeEach(() => {
    drawVolumeBarMock.mockReset();
    markerMock.mockReset();
  });

  it('returns early when bars config or metrics are missing', () => {
    draw(
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      { series: { bars: null } } as never,
      {} as never,
      {
        timeScale: {
          metadata: { intervalSize: 10, scrollOffset: 0 },
          startBarIndex: 0,
          endBarIndex: 0,
          getLastVisibleBarIndex: () => 0,
        },
        dataMap: { ohlcvs: { open: new Float64Array(1), close: new Float64Array(1), volume: new Float64Array(1) } },
      } as never,
      {} as never,
      {} as never,
      {} as never,
    );
    expect(drawVolumeBarMock).not.toHaveBeenCalled();
  });

  it('draws bars by direction and marker for last visible', () => {
    draw(
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      { series: { bars: {} }, markers: { value: { mode: 'last-data' } }, yAxis: {}, valueLabelFormatter: (v: number) => `${v}` } as never,
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
            close: new Float64Array([2, 1, 3]),
            volume: new Float64Array([10, 20, 30]),
          },
        },
      } as never,
      {} as never,
      { paddedBottomPx: 100 } as never,
      { valueToY: (v: number) => v } as never,
    );

    expect(drawVolumeBarMock.mock.calls[0][2]).toBe('up');
    expect(drawVolumeBarMock.mock.calls[1][2]).toBe('down');
    expect(drawVolumeBarMock.mock.calls[2][2]).toBe('flat');
    expect(markerMock).toHaveBeenCalled();
  });
});
