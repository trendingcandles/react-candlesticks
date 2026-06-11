import { beforeEach, describe, expect, it, vi } from 'vitest';

const drawLineSeriesMock = vi.hoisted(() => vi.fn());
const markerMock = vi.hoisted(() => vi.fn());

vi.mock('../../../drawing/series/drawLineSeries', () => ({ default: drawLineSeriesMock }));
vi.mock('../../../drawing/valueMarker/drawValueMarker', () => ({ default: markerMock }));

import draw from '../draw';

describe('rsi draw', () => {
  beforeEach(() => {
    drawLineSeriesMock.mockReset();
    markerMock.mockReset();
  });

  it('returns early when line config is missing', () => {
    draw(
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {
        id: 'r1',
        series: { value: null },
        markers: { value: null },
        yAxis: {},
        valueLabelFormatter: (v: number) => String(v),
      } as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
    );
    expect(drawLineSeriesMock).not.toHaveBeenCalled();
  });

  it('draws rsi line and marker', () => {
    drawLineSeriesMock.mockReturnValue({ lastBarIndex: 2 });
    draw(
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {
        id: 'r1',
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
            r1: { outputValues: { value: new Float64Array([40, 45, 50]) } },
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
