import { describe, expect, it, vi } from 'vitest';
import clearChartCrosshairs from '../crosshairs/clearChartCrosshairs';
import drawChartValueCrosshairLabel from '../crosshairs/drawChartValueCrosshairLabel';
import drawChartCrosshairs from '../crosshairs/drawChartCrosshairs';
import { createMockContext } from '../../__tests__/testContext';

describe('crosshair drawing', () => {
  it('clears full crosshair canvas', () => {
    const ctx = createMockContext();
    clearChartCrosshairs(ctx);
    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 300, 150);
  });

  it('draws a value crosshair label', () => {
    const ctx = createMockContext();
    drawChartValueCrosshairLabel(
      ctx,
      { drawingAreaX: 100, drawingAreaX1: 200 } as never,
      {
        backgroundColor: '#111',
        color: '#fff',
        fontSize: 10,
        fontFamily: 'sans',
        fontWeight: '400',
        fontStyle: 'normal',
        hPadding: 4,
        vPadding: 2,
      } as never,
      { side: 'right', offsetPx: 5, width: 40, labelFormatter: (v: number) => `${v.toFixed(1)}` } as never,
      50,
      12.345,
    );

    expect(ctx.fillRect).toHaveBeenCalled();
    expect(ctx.fillText).toHaveBeenCalledWith('12.3', 209, 50);
  });

  it('draws crosshair lines/labels and emits move callback', () => {
    const ctx = createMockContext();
    const onMove = vi.fn();

    drawChartCrosshairs(
      ctx,
      {
        xAxis: { timeZoneId: 'UTC' },
        crosshairs: {
          value: {
            line: { color: '#aaa', width: 1, style: 'dashed', dashes: [2, 2] },
            label: {
              backgroundColor: '#111',
              color: '#fff',
              fontSize: 10,
              fontFamily: 'sans',
              fontWeight: '400',
              fontStyle: 'normal',
              hPadding: 4,
              vPadding: 2,
            },
          },
          time: {
            line: { color: '#bbb', width: 1, style: 'solid' },
            label: {
              hPadding: 3,
              vPadding: 2,
              backgroundColor: '#000',
              color: '#fff',
              fontSize: 10,
              fontFamily: 'sans',
              fontWeight: '400',
              fontStyle: 'normal',
              formatter: () => '12:00',
            },
          },
        },
      } as never,
      [{ id: 'p1', paddingTop: 0, paddingBottom: 0, yAxes: { leftAxes: [], rightAxes: [] } }] as never,
      { drawingAreaX: 10, drawingAreaX1: 210, drawingAreaY: 0, drawingAreaY1: 100 } as never,
      {
        p1: {
          panelMetrics: { topPx: 0, heightPx: 100 },
          layerMetricsByScale: { s1: { min: 0, max: 100 } },
        },
      } as never,
      {
        indexProvider: { indexToTimestamp: () => 1000 },
        timeScale: {
          metadata: { granularity: 'm1' },
          xToIntervalX: (x: number) => x,
          xToBarIndex: (x: number) => Math.floor(x),
        },
        scrollOffset: 0,
        xToDataPoint: () => ({ barIndex: 1 }),
      } as never,
      20,
      40,
      onMove,
    );

    expect(onMove).toHaveBeenCalledWith(1000, { barIndex: 1 });
    expect(ctx.stroke).toHaveBeenCalled();
    expect(ctx.fillText).toHaveBeenCalledWith('12:00', expect.any(Number), expect.any(Number));
  });

  it('does not draw value crosshair labels below zero for positive scales', () => {
    const ctx = createMockContext();

    drawChartCrosshairs(
      ctx,
      {
        xAxis: { timeZoneId: 'UTC' },
        crosshairs: {
          value: {
            line: { color: '#aaa', width: 1, style: 'solid' },
            label: {
              backgroundColor: '#111',
              color: '#fff',
              fontSize: 10,
              fontFamily: 'sans',
              fontWeight: '400',
              fontStyle: 'normal',
              hPadding: 4,
              vPadding: 2,
            },
          },
          time: false,
        },
      } as never,
      [{
        id: 'p1',
        paddingTop: 0,
        paddingBottom: 0,
        yAxes: {
          leftAxes: [],
          rightAxes: [
            {
              side: 'right',
              offsetPx: 0,
              width: 40,
              labelFormatter: (v: number) => `${v.toFixed(1)}`,
              scale: { key: 's1', domain: 'volume', range: { type: 'positive' } },
            },
          ],
        },
      }] as never,
      { drawingAreaX: 10, drawingAreaX1: 210, drawingAreaY: 0, drawingAreaY1: 100 } as never,
      {
        p1: {
          panelMetrics: { topPx: 0, heightPx: 100 },
          layerMetricsByScale: { s1: { min: 0, max: 100 } },
        },
      } as never,
      {
        indexProvider: { indexToTimestamp: () => 1000 },
        timeScale: {
          metadata: { granularity: 'm1' },
          xToIntervalX: (x: number) => x,
          xToBarIndex: (x: number) => Math.floor(x),
        },
        scrollOffset: 0,
        xToDataPoint: () => ({ barIndex: 1 }),
      } as never,
      20,
      120, // below panel, maps to a negative value before clamp
    );

    // Only horizontal value line should be drawn, not label text.
    expect(ctx.fillText).not.toHaveBeenCalled();
  });

  it('does not draw value crosshair labels outside bounded scale ranges', () => {
    const ctx = createMockContext();

    drawChartCrosshairs(
      ctx,
      {
        xAxis: { timeZoneId: 'UTC' },
        crosshairs: {
          value: {
            line: { color: '#aaa', width: 1, style: 'solid' },
            label: {
              backgroundColor: '#111',
              color: '#fff',
              fontSize: 10,
              fontFamily: 'sans',
              fontWeight: '400',
              fontStyle: 'normal',
              hPadding: 4,
              vPadding: 2,
            },
          },
          time: false,
        },
      } as never,
      [{
        id: 'p1',
        paddingTop: 0,
        paddingBottom: 0,
        yAxes: {
          leftAxes: [],
          rightAxes: [
            {
              side: 'right',
              offsetPx: 0,
              width: 40,
              labelFormatter: (v: number) => `${v.toFixed(1)}`,
              scale: { key: 's1', domain: 'value', range: { type: 'bounded', min: 0, max: 100 } },
            },
          ],
        },
      }] as never,
      { drawingAreaX: 10, drawingAreaX1: 210, drawingAreaY: 0, drawingAreaY1: 100 } as never,
      {
        p1: {
          panelMetrics: { topPx: 0, heightPx: 100 },
          layerMetricsByScale: { s1: { min: 0, max: 100 } },
        },
      } as never,
      {
        indexProvider: { indexToTimestamp: () => 1000 },
        timeScale: {
          metadata: { granularity: 'm1' },
          xToIntervalX: (x: number) => x,
          xToBarIndex: (x: number) => Math.floor(x),
        },
        scrollOffset: 0,
        xToDataPoint: () => ({ barIndex: 1 }),
      } as never,
      20,
      120, // below panel, maps to a negative value before clamp
    );

    expect(ctx.fillText).not.toHaveBeenCalled();
  });
});
