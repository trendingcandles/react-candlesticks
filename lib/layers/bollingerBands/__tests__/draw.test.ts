import { beforeEach, describe, expect, it, vi } from 'vitest';

const markerMock = vi.hoisted(() => vi.fn());
const drawLineSeriesMock = vi.hoisted(() => vi.fn());

vi.mock('../../../drawing/series/drawLineSeries', () => ({ default: drawLineSeriesMock }));
vi.mock('../../../drawing/valueMarker/drawValueMarker', () => ({ default: markerMock }));

import draw from '../draw';

const createContext = () => ({
  save: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  setLineDash: vi.fn(),
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
});

describe('bollinger bands draw', () => {
  beforeEach(() => {
    drawLineSeriesMock.mockReset();
    drawLineSeriesMock.mockReturnValue({ lastBarIndex: 2 });
    markerMock.mockReset();
  });

  it('uses middle output values for the value marker', () => {
    draw(
      createContext() as never,
      createContext() as never,
      {} as never,
      {} as never,
      {
        id: 'bb-1',
        offset: 0,
        series: {
          upper: { color: '#f00', width: 1, style: 'solid' },
          middle: { color: '#00f', width: 1, style: 'solid' },
          lower: { color: '#0f0', width: 1, style: 'solid' },
        },
        bands: { channel: null },
        markers: { value: { mode: 'last-data' } },
        yAxis: {},
        valueLabelFormatter: (value: number) => `${value}`,
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
            'bb-1': {
              outputValues: {
                middle: new Float64Array([100, 101, 102]),
                upper: new Float64Array([105, 106, 107]),
                lower: new Float64Array([95, 96, 97]),
              },
            },
          },
        },
      } as never,
      {} as never,
      {} as never,
      { valueToY: (value: number) => value } as never,
    );

    expect(markerMock).toHaveBeenCalled();
    expect(markerMock.mock.calls[0][13]).toBe(102);
    expect(drawLineSeriesMock).toHaveBeenCalledTimes(3);
    expect(drawLineSeriesMock).toHaveBeenLastCalledWith(expect.objectContaining({
      barOffset: 0,
      values: expect.any(Float64Array),
    }));
  });
});
