import { createRef } from 'react';
import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ChartCanvases, { ChartCanvasesHandle } from '../ChartCanvases';

const getCanvasContextMock = vi.hoisted(() => vi.fn());
const drawChartMock = vi.hoisted(() => vi.fn());
const drawCrosshairsMock = vi.hoisted(() => vi.fn());

vi.mock('../../../drawing/getCanvasContext', () => ({ default: getCanvasContextMock }));
vi.mock('../../../drawing/chart/drawChart', () => ({ default: drawChartMock }));
vi.mock('../../../drawing/chart/crosshairs/drawChartCrosshairs', () => ({ default: drawCrosshairsMock }));

describe('ChartCanvases', () => {
  beforeEach(() => {
    getCanvasContextMock.mockClear();
    drawChartMock.mockClear();
    drawCrosshairsMock.mockClear();
  });

  it('exposes imperative draw APIs and calls draw modules', () => {
    const ref = createRef<ChartCanvasesHandle>();

    const ctx = { canvas: { width: 10, height: 10 }, clearRect: vi.fn() } as never;
    getCanvasContextMock.mockReturnValue(ctx);
    drawChartMock.mockReturnValue({ p1: { panelMetrics: {}, layerMetricsByScale: {} } });

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });

    render(
      <ChartCanvases
        ref={ref}
        width={300}
        height={200}
        layout={{ drawingAreaX: 10, drawingAreaWidth: 290, drawingAreaX1: 299, chartWidth: 300, chartHeight: 200, dpr: 2 } as never}
        config={{} as never}
        panels={[{ id: 'p1' }] as never}
      />,
    );

    ref.current?.requestDraw({} as never, { drawingAreaWidth: 290, chartWidth: 300, chartHeight: 200, drawingAreaX1: 299, dpr: 2 } as never, vi.fn());
    ref.current?.requestDrawCrosshairs({ chartWidth: 300, chartHeight: 200, dpr: 2 } as never, {} as never, 10, 20, vi.fn());
    ref.current?.updateCrosshairsCanvas({} as never);
    ref.current?.hideCrosshairs({} as never);

    expect(drawChartMock).toHaveBeenCalled();
    expect(drawCrosshairsMock).toHaveBeenCalled();
  });

  it('skips crosshairs canvas and crosshair drawing when disabled', () => {
    const ref = createRef<ChartCanvasesHandle>();

    const ctx = { canvas: { width: 10, height: 10 } } as never;
    getCanvasContextMock.mockReturnValue(ctx);
    drawChartMock.mockReturnValue({ p1: { panelMetrics: {}, layerMetricsByScale: {} } });

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });

    const { container } = render(
      <ChartCanvases
        ref={ref}
        width={300}
        height={200}
        layout={{ drawingAreaX: 10, drawingAreaWidth: 290, drawingAreaX1: 299, chartWidth: 300, chartHeight: 200, dpr: 2 } as never}
        config={{} as never}
        panels={[{ id: 'p1' }] as never}
        showCrosshairsCanvas={false}
      />,
    );

    ref.current?.requestDraw({} as never, { drawingAreaWidth: 290, chartWidth: 300, chartHeight: 200, drawingAreaX1: 299, dpr: 2 } as never, vi.fn());
    ref.current?.requestDrawCrosshairs({ chartWidth: 300, chartHeight: 200, dpr: 2 } as never, {} as never, 10, 20, vi.fn());

    expect(drawChartMock).toHaveBeenCalled();
    expect(drawCrosshairsMock).not.toHaveBeenCalled();
    expect(container.querySelector('#ch-canvas')).toBeNull();
  });
});
