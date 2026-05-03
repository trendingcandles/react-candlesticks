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

describe('ema draw', () => {
  beforeEach(() => {
    startMock.mockReset();
    drawMock.mockReset();
    endMock.mockReset();
    markerMock.mockReset();
  });

  it('returns early when chart metrics are missing', () => {
    draw({} as never, {} as never, {} as never, {} as never, { id: 'e1', series: { value: { color: '#f90' } } } as never, {} as never, {} as never, null, {} as never, {} as never);
    expect(startMock).not.toHaveBeenCalled();
  });

  it('draws ema line with offset and marker', () => {
    draw(
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {
        id: 'e1',
        offset: 1,
        series: { value: { color: '#f90' } },
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
        layersData: {
          layerDataInstances: {
            e1: { outputValues: { value: new Float64Array([5, 6, 7]) } },
          },
        },
      } as never,
      {} as never,
      {} as never,
      { valueToY: (v: number) => v } as never,
    );

    expect(startMock).toHaveBeenCalledTimes(1);
    expect(drawMock).toHaveBeenCalledTimes(2);
    expect(endMock).toHaveBeenCalledTimes(1);
    expect(markerMock).toHaveBeenCalledTimes(1);
  });
});
