import { beforeEach, describe, expect, it, vi } from 'vitest';

const drawLineSeriesMock = vi.hoisted(() => vi.fn());
const markerMock = vi.hoisted(() => vi.fn());

vi.mock('../../../drawing/series/drawLineSeries', () => ({ default: drawLineSeriesMock }));
vi.mock('../../../drawing/valueMarker/drawValueMarker', () => ({ default: markerMock }));

import draw from '../draw';

describe('priceLine draw', () => {
  beforeEach(() => {
    drawLineSeriesMock.mockReset();
    markerMock.mockReset();
  });

  it('returns early when metrics are missing or line config absent', () => {
    draw({} as never, {} as never, {} as never, {} as never, { id: 'l1', series: { value: null } } as never, {} as never, {} as never, null, null as never, null as never);
    expect(drawLineSeriesMock).not.toHaveBeenCalled();
  });

  it('draws line sequence and value marker', () => {
    drawLineSeriesMock.mockReturnValue({ lastBarIndex: 2 });
    draw(
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      { id: 'l1', series: { value: { color: '#00f' } }, markers: { value: { mode: 'last-data' } }, yAxis: {}, valueLabelFormatter: (v: number) => `${v}` } as never,
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
            l1: { outputValues: { price: new Float64Array([Number.NaN, 10, 20]) } },
          },
        },
      } as never,
      {} as never,
      {} as never,
      { valueToY: (v: number) => v } as never,
    );

    expect(drawLineSeriesMock).toHaveBeenCalledTimes(1);
    expect(markerMock).toHaveBeenCalled();
  });
});
