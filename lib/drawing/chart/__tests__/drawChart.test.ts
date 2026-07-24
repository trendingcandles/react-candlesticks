import { describe, expect, it, vi } from 'vitest';
import { createMockContext } from '../../__tests__/testContext';

const {
  calculateChartMetricsMock,
  drawBordersMock,
  drawTimeGridLinesMock,
  drawTimeGridLabelsMock,
  drawPanelsMock,
  drawChartWatermarkMock,
} = vi.hoisted(() => ({
  calculateChartMetricsMock: vi.fn(),
  drawBordersMock: vi.fn(),
  drawTimeGridLinesMock: vi.fn(),
  drawTimeGridLabelsMock: vi.fn(),
  drawPanelsMock: vi.fn(),
  drawChartWatermarkMock: vi.fn(),
}));
vi.mock('../../../metrics/chart/calculateChartMetrics', () => ({ default: calculateChartMetricsMock }));
vi.mock('../borders/drawBorders', () => ({ default: drawBordersMock }));
vi.mock('../grid/time/drawTimeGridLines', () => ({ default: drawTimeGridLinesMock }));
vi.mock('../grid/time/drawTimeGridLabels', () => ({ default: drawTimeGridLabelsMock }));
vi.mock('../../panel/drawPanels', () => ({ default: drawPanelsMock }));
vi.mock('../watermark/drawChartWatermark', () => ({ default: drawChartWatermarkMock }));

import drawChart from '../drawChart';

describe('drawChart', () => {
  it('returns early when chart metrics are null', () => {
    calculateChartMetricsMock.mockReturnValue(null);
    const drawings = createMockContext();
    const axes = createMockContext();

    const result = drawChart(drawings, axes, {} as never, [] as never, { timeScale: {} } as never, {} as never);

    expect(result).toBeUndefined();
    expect(drawBordersMock).not.toHaveBeenCalled();
    expect(drawChartWatermarkMock).not.toHaveBeenCalled();
    expect(drawings.clearRect).toHaveBeenCalled();
    expect(axes.clearRect).toHaveBeenCalled();
  });

  it('draws chart layers and returns panel metrics map', () => {
    calculateChartMetricsMock.mockReturnValue({});
    drawPanelsMock.mockReturnValue({ p1: { panelMetrics: {} } });

    const result = drawChart(
      createMockContext(),
      createMockContext(),
      {} as never,
      [{ id: 'p1' }] as never,
      { timeScale: { gridLines: [] } } as never,
      {} as never,
    );

    expect(drawBordersMock).toHaveBeenCalled();
    expect(drawTimeGridLinesMock).toHaveBeenCalled();
    expect(drawTimeGridLabelsMock).toHaveBeenCalled();
    expect(drawChartWatermarkMock).toHaveBeenCalled();
    expect(result).toEqual({ p1: { panelMetrics: {} } });
  });
});
