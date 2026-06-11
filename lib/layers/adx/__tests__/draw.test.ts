import { beforeEach, describe, expect, it, vi } from 'vitest';

const drawLineSeriesMock = vi.hoisted(() => vi.fn());
const markerMock = vi.hoisted(() => vi.fn());

vi.mock('../../../drawing/series/drawLineSeries', () => ({ default: drawLineSeriesMock }));
vi.mock('../../../drawing/valueMarker/drawValueMarker', () => ({ default: markerMock }));

import draw from '../draw';

describe('adx draw', () => {
  beforeEach(() => {
    drawLineSeriesMock.mockReset();
    markerMock.mockReset();
  });

  it('returns early without required metrics', () => {
    draw(
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      null,
      null,
      null,
    );

    expect(drawLineSeriesMock).not.toHaveBeenCalled();
  });

  it('delegates line drawing and draws the marker at the resolved bar', () => {
    const context = {};
    const values = new Float64Array([10, 20, 30]);
    const lineConfig = { color: '#ddd' };
    const markerConfig = { mode: 'last-visible' };
    const valueToY = (value: number) => value;
    drawLineSeriesMock.mockReturnValue({ lastBarIndex: 1 });

    draw(
      context as never,
      {} as never,
      {} as never,
      {} as never,
      {
        id: 'adx-1',
        series: { value: lineConfig },
        markers: { value: markerConfig },
        yAxis: {},
        valueLabelFormatter: (value: number) => String(value),
      } as never,
      {} as never,
      {
        timeScale: {
          metadata: { intervalSize: 10, scrollOffset: 5 },
          startBarIndex: 0,
          endBarIndex: 2,
          getLastVisibleBarIndex: () => 2,
        },
        layersData: {
          layerDataInstances: {
            'adx-1': { outputValues: { value: values } },
          },
        },
      } as never,
      {} as never,
      {} as never,
      { valueToY } as never,
    );

    expect(drawLineSeriesMock).toHaveBeenCalledWith({
      context,
      values,
      lineConfig,
      valueToY,
      startBarIndex: 0,
      endBarIndex: 2,
      intervalSize: 10,
      scrollOffset: 5,
    });
    expect(markerMock).toHaveBeenCalledTimes(1);
    expect(markerMock.mock.calls[0].at(-1)).toBe(30);
  });

  it('does not draw a marker when the series has no visible values', () => {
    drawLineSeriesMock.mockReturnValue(null);

    draw(
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {
        id: 'adx-1',
        series: { value: {} },
        markers: { value: {} },
        yAxis: {},
        valueLabelFormatter: (value: number) => String(value),
      } as never,
      {} as never,
      {
        timeScale: {
          metadata: { intervalSize: 10, scrollOffset: 0 },
          startBarIndex: 0,
          endBarIndex: 0,
          getLastVisibleBarIndex: () => 0,
        },
        layersData: {
          layerDataInstances: {
            'adx-1': { outputValues: { value: new Float64Array([Number.NaN]) } },
          },
        },
      } as never,
      {} as never,
      {} as never,
      { valueToY: (value: number) => value } as never,
    );

    expect(markerMock).not.toHaveBeenCalled();
  });
});
