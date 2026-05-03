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

describe('priceLine draw', () => {
  beforeEach(() => {
    startMock.mockReset();
    drawMock.mockReset();
    endMock.mockReset();
    markerMock.mockReset();
  });

  it('returns early when metrics are missing or line config absent', () => {
    draw({} as never, {} as never, {} as never, {} as never, { id: 'l1', series: { value: null } } as never, {} as never, {} as never, null, null as never, null as never);
    expect(startMock).not.toHaveBeenCalled();
  });

  it('draws line sequence and value marker', () => {
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

    expect(startMock).toHaveBeenCalledTimes(1);
    expect(drawMock).toHaveBeenCalledTimes(1);
    expect(endMock).toHaveBeenCalledTimes(1);
    expect(markerMock).toHaveBeenCalled();
  });
});
