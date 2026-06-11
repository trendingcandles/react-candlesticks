import { beforeEach, describe, expect, it, vi } from 'vitest';

const drawLineSeriesMock = vi.hoisted(() => vi.fn());
const markerMock = vi.hoisted(() => vi.fn());

vi.mock('../../../drawing/series/drawLineSeries', () => ({ default: drawLineSeriesMock }));
vi.mock('../../../drawing/valueMarker/drawValueMarker', () => ({ default: markerMock }));

import draw from '../draw';

describe('stochastic draw', () => {
  beforeEach(() => {
    drawLineSeriesMock.mockReset();
    markerMock.mockReset();
  });

  it('returns early when both line configs are missing', () => {
    draw({} as never, {} as never, {} as never, {} as never, { id: 'st1', series: { k: null, d: null } } as never, {} as never, {} as never, {} as never, {} as never, {} as never);
    expect(drawLineSeriesMock).not.toHaveBeenCalled();
  });

  it('draws k/d lines and both markers', () => {
    drawLineSeriesMock.mockReturnValue({ lastBarIndex: 2 });
    draw(
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {
        id: 'st1',
        series: { k: { color: '#111' }, d: { color: '#222' } },
        markers: { k: { mode: 'last-data' }, d: { mode: 'last-data' } },
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
        layersData: {
          layerDataInstances: {
            st1: {
              outputValues: {
                kSmoothed: new Float64Array([10, 11, 12]),
                d: new Float64Array([20, 21, 22]),
              },
            },
          },
        },
      } as never,
      {} as never,
      {} as never,
      { valueToY: (v: number) => v } as never,
    );

    expect(drawLineSeriesMock).toHaveBeenCalledTimes(2);
    expect(markerMock).toHaveBeenCalledTimes(2);
  });
});
