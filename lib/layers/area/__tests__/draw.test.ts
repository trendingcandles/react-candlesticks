import { beforeEach, describe, expect, it, vi } from 'vitest';

const drawLineSeriesMock = vi.hoisted(() => vi.fn());
const markerMock = vi.hoisted(() => vi.fn());

vi.mock('../../../drawing/series/drawLineSeries', () => ({ default: drawLineSeriesMock }));
vi.mock('../../../drawing/valueMarker/drawValueMarker', () => ({ default: markerMock }));

import draw from '../draw';

describe('area draw', () => {
  beforeEach(() => {
    drawLineSeriesMock.mockReset();
    markerMock.mockReset();
  });

  it('draws gradient fill, line sequence, and value marker', () => {
    const gradient = { addColorStop: vi.fn() };
    const context = {
      save: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      createLinearGradient: vi.fn(() => gradient),
      fillStyle: '',
    };
    drawLineSeriesMock.mockReturnValue({ lastBarIndex: 2 });

    draw(
      context as never,
      {} as never,
      {} as never,
      {} as never,
      {
        id: 'area1',
        series: {
          value: {
            line: { color: '#00f', width: 2, style: 'solid' },
            fill: { topColor: '#00f8', bottomColor: 'transparent' },
          },
        },
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
            area1: { outputValues: { price: new Float64Array([10, Number.NaN, 20]) } },
          },
        },
      } as never,
      {} as never,
      { topPx: 5, bottomPx: 105 } as never,
      { valueToY: (v: number) => v } as never,
    );

    expect(context.createLinearGradient).toHaveBeenCalledWith(0, 5, 0, 105);
    expect(gradient.addColorStop).toHaveBeenNthCalledWith(1, 0, '#00f8');
    expect(gradient.addColorStop).toHaveBeenNthCalledWith(2, 1, 'transparent');
    expect(context.fill).toHaveBeenCalledTimes(2);
    expect(drawLineSeriesMock).toHaveBeenCalledTimes(1);
    expect(markerMock).toHaveBeenCalled();
  });

  it('can render fill without line config', () => {
    const gradient = { addColorStop: vi.fn() };
    const context = {
      save: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      createLinearGradient: vi.fn(() => gradient),
      fillStyle: '',
    };

    draw(
      context as never,
      {} as never,
      {} as never,
      {} as never,
      {
        id: 'area1',
        series: {
          value: {
            line: null,
            fill: { topColor: '#00f8', bottomColor: 'transparent' },
          },
        },
        markers: { value: null },
      } as never,
      {} as never,
      {
        timeScale: {
          metadata: { intervalSize: 10, scrollOffset: 0 },
          startBarIndex: 0,
          endBarIndex: 1,
          getLastVisibleBarIndex: () => 1,
        },
        layersData: {
          layerDataInstances: {
            area1: { outputValues: { price: new Float64Array([10, 20]) } },
          },
        },
      } as never,
      {} as never,
      { topPx: 5, bottomPx: 105 } as never,
      { valueToY: (v: number) => v } as never,
    );

    expect(context.fill).toHaveBeenCalledTimes(1);
    expect(drawLineSeriesMock).not.toHaveBeenCalled();
  });
});
