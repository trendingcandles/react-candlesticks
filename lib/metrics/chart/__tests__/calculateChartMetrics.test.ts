import { describe, expect, it } from 'vitest';
import calculateChartMetrics from '../calculateChartMetrics';
import { Layout } from '../../../domain/types/Layout';
import { PanelConfigComplete } from '../../../config/panel/PanelConfig';

const layout: Layout = {
  dpr: 1,
  chartWidth: 800,
  chartHeight: 600,
  drawingAreaX: 0,
  drawingAreaY: 0,
  drawingAreaWidth: 800,
  drawingAreaHeight: 300,
  drawingAreaX1: 800,
  drawingAreaY1: 300,
  drawingAreaRight: 0,
  drawingAreaBottom: 300,
};

describe('calculateChartMetrics', () => {
  it('computes panel metrics by height ratio', () => {
    const panels = [
      { id: 'price', heightRatio: 2, paddingTop: 10, paddingBottom: 20 },
      { id: 'indicator', heightRatio: 1, paddingTop: 5, paddingBottom: 5 },
    ] as unknown as PanelConfigComplete[];

    const metrics = calculateChartMetrics(panels, layout);
    expect(metrics?.totalPanelsHeightUnits).toBe(3);

    const price = metrics?.getPanelMetrics('price');
    const indicator = metrics?.getPanelMetrics('indicator');
    expect(price?.heightPx).toBe(200);
    expect(price?.paddedHeightPx).toBe(170);
    expect(indicator?.topPx).toBe(200);
    expect(indicator?.bottomPx).toBe(300);
  });
});
