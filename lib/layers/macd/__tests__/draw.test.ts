import { beforeEach, describe, expect, it, vi } from 'vitest';

const startMock = vi.hoisted(() => vi.fn());
const drawLineMock = vi.hoisted(() => vi.fn());
const endMock = vi.hoisted(() => vi.fn());
const drawBarMock = vi.hoisted(() => vi.fn());
const markerMock = vi.hoisted(() => vi.fn());

vi.mock('../../../drawing/elements/line/startDrawLine', () => ({ default: startMock }));
vi.mock('../../../drawing/elements/line/drawLine', () => ({ default: drawLineMock }));
vi.mock('../../../drawing/elements/line/endDrawLine', () => ({ default: endMock }));
vi.mock('../../../drawing/elements/drawBar', () => ({ default: drawBarMock }));
vi.mock('../../../drawing/valueMarker/drawValueMarker', () => ({ default: markerMock }));

import draw from '../draw';

describe('macd draw', () => {
  beforeEach(() => {
    startMock.mockReset();
    drawLineMock.mockReset();
    endMock.mockReset();
    drawBarMock.mockReset();
    markerMock.mockReset();
  });

  it('returns early when all series configs are absent', () => {
    draw(
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {
        id: 'm1',
        series: { macd: null, signal: null, histogramUp: null, histogramDown: null },
        markers: { macd: null, signal: null },
        yAxis: {},
        valueLabelFormatter: (v: number) => String(v),
      } as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
    );

    expect(startMock).not.toHaveBeenCalled();
    expect(drawBarMock).not.toHaveBeenCalled();
  });

  it('draws macd + signal lines, histogram bars, and markers', () => {
    draw(
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {
        id: 'm1',
        series: {
          macd: { color: '#0ff' },
          signal: { color: '#f0f' },
          histogramUp: { width: 0.8, fillColor: '#0f0' },
          histogramDown: { width: 0.8, fillColor: '#f00' },
        },
        markers: {
          macd: { mode: 'last-data' },
          signal: { mode: 'last-data' },
        },
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
            m1: {
              outputValues: {
                macd: new Float64Array([1, 2, 3]),
                signal: new Float64Array([1.5, 2.5, 3.5]),
                histogram: new Float64Array([1, -1, 0.5]),
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
    expect(drawLineMock).toHaveBeenCalledTimes(4);
    expect(endMock).toHaveBeenCalledTimes(2);
    expect(drawBarMock).toHaveBeenCalledTimes(3);
    expect(markerMock).toHaveBeenCalledTimes(2);
  });
});
