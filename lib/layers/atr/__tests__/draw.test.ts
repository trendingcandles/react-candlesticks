import { beforeEach, describe, expect, it, vi } from 'vitest';

const drawLineSeriesMock = vi.hoisted(() => vi.fn());
const markerMock = vi.hoisted(() => vi.fn());

vi.mock('../../../drawing/series/drawLineSeries', () => ({ default: drawLineSeriesMock }));
vi.mock('../../../drawing/valueMarker/drawValueMarker', () => ({ default: markerMock }));

import draw from '../draw';

describe('atr draw', () => {
  beforeEach(() => {
    drawLineSeriesMock.mockReset();
    markerMock.mockReset();
  });

  it('returns early without required metrics', () => {
    draw({} as never, {} as never, {} as never, {} as never, { id: 'a1', series: { value: { color: '#f90' } } } as never, {} as never, {} as never, null, null, null);
    expect(drawLineSeriesMock).not.toHaveBeenCalled();
  });

  it('draws atr line and value marker', () => {
    drawLineSeriesMock.mockReturnValue({ lastBarIndex: 2 });
    draw(
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {
        id: 'a1',
        series: { value: { color: '#f90' } },
        markers: { value: { mode: 'last-data' } },
        yAxis: {},
        valueLabelFormatter: (v: number) => String(v),
      } as never,
      {} as never,
      {
        timeScale: {
          metadata: { intervalSize: 10, scrollOffset: 0 },
          startBarIndex: 0,
          endBarIndex: 2,
          getLastVisibleBarIndex: () => 2,
        },
        layersData: {
          layerDataInstances: {
            a1: { outputValues: { value: new Float64Array([Number.NaN, 2, 3]) } },
          },
        },
      } as never,
      {} as never,
      {} as never,
      { valueToY: (v: number) => v } as never,
    );

    expect(drawLineSeriesMock).toHaveBeenCalledTimes(1);
    expect(markerMock).toHaveBeenCalledTimes(1);
  });
});
