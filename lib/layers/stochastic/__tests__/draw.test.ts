import { beforeEach, describe, expect, it, vi } from 'vitest';

const startMock = vi.hoisted(() => vi.fn());
const drawMock = vi.hoisted(() => vi.fn());
const endMock = vi.hoisted(() => vi.fn());
const markerMock = vi.hoisted(() => vi.fn());

vi.mock('../../../drawing/elements/line/startDrawLine', () => ({ default: startMock }));
vi.mock('../../../drawing/elements/line/drawLine', () => ({ default: drawMock }));
vi.mock('../../../drawing/elements/line/endDrawLine', () => ({ default: endMock }));
vi.mock('../../../drawing/valueMarker/drawValueMarker', () => ({ default: markerMock }));

import draw from '../draw';

describe('stochastic draw', () => {
  beforeEach(() => {
    startMock.mockReset();
    drawMock.mockReset();
    endMock.mockReset();
    markerMock.mockReset();
  });

  it('returns early when both line configs are missing', () => {
    draw({} as never, {} as never, {} as never, {} as never, { id: 'st1', series: { k: null, d: null } } as never, {} as never, {} as never, {} as never, {} as never, {} as never);
    expect(startMock).not.toHaveBeenCalled();
  });

  it('draws k/d lines and both markers', () => {
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

    expect(startMock).toHaveBeenCalledTimes(2);
    expect(drawMock).toHaveBeenCalledTimes(4);
    expect(endMock).toHaveBeenCalledTimes(2);
    expect(markerMock).toHaveBeenCalledTimes(2);
  });
});
