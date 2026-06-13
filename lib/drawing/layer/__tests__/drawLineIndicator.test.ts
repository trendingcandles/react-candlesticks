import { beforeEach, describe, expect, it, vi } from 'vitest';

const drawLineSeriesMock = vi.hoisted(() => vi.fn());
const drawValueMarkerMock = vi.hoisted(() => vi.fn());

vi.mock('../../series/drawLineSeries', () => ({ default: drawLineSeriesMock }));
vi.mock('../../valueMarker/drawValueMarker', () => ({ default: drawValueMarkerMock }));

import drawLineIndicator from '../drawLineIndicator';

describe('drawLineIndicator', () => {
  beforeEach(() => {
    drawLineSeriesMock.mockReset();
    drawValueMarkerMock.mockReset();
  });

  it('draws configured outputs in order with offsets and markers', () => {
    const firstValues = new Float64Array([1, 2, 3]);
    const secondValues = new Float64Array([4, 5, 6]);
    drawLineSeriesMock
      .mockReturnValueOnce({ lastBarIndex: 1 })
      .mockReturnValueOnce({ lastBarIndex: 2 });

    drawLineIndicator(
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {
        id: 'indicator',
        yAxis: {},
        valueLabelFormatter: (value: number) => String(value),
      } as never,
      {} as never,
      {
        timeScale: {
          metadata: { intervalSize: 10, scrollOffset: 5 },
          startBarIndex: 0,
          endBarIndex: 2,
          getLastVisibleBarIndex: (barIndex: number) => barIndex,
        },
        layersData: {
          layerDataInstances: {
            indicator: {
              outputValues: {
                first: firstValues,
                second: secondValues,
              },
            },
          },
        },
      } as never,
      {} as never,
      {} as never,
      { valueToY: (value: number) => value } as never,
      [
        { output: 'first', line: { color: 'red' } as never, marker: { mode: 'last-data' } as never },
        { output: 'second', line: { color: 'blue' } as never, marker: { mode: 'last-data' } as never, barOffset: 2 },
      ],
    );

    expect(drawLineSeriesMock).toHaveBeenCalledTimes(2);
    expect(drawLineSeriesMock.mock.calls[0][0]).not.toHaveProperty('barOffset');
    expect(drawLineSeriesMock.mock.calls[1][0]).toMatchObject({
      values: secondValues,
      barOffset: 2,
    });
    expect(drawValueMarkerMock).toHaveBeenCalledTimes(2);
    expect(drawValueMarkerMock.mock.calls[0].at(-1)).toBe(2);
    expect(drawValueMarkerMock.mock.calls[1].at(-1)).toBe(6);
  });

  it('returns before reading viewport data when metrics or lines are absent', () => {
    drawLineIndicator(
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
      [{ output: 'value', line: null, marker: null }],
    );

    drawLineIndicator(
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      [{ output: 'value', line: null, marker: null }],
    );

    expect(drawLineSeriesMock).not.toHaveBeenCalled();
  });
});
