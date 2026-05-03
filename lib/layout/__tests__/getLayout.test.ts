import { describe, expect, it } from 'vitest';
import getLayout from '../getLayout';
import { ChartConfigComplete } from '../../config/chart/ChartConfig';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';

const mkPanel = (left: number, right: number) => ({
  yAxes: {
    leftTotalWidth: left,
    rightTotalWidth: right,
  },
}) as unknown as PanelConfigComplete;

describe('getLayout', () => {
  it('computes layout with xAxis height and max axis widths', () => {
    const chartConfig = {
      backgroundColor: 'white',
      borders: null,
      grid: null,
      crosshairs: null,
      xAxis: { height: 60 },
    } as unknown as ChartConfigComplete;

    const layout = getLayout(1000, 600, 2, chartConfig, [
      mkPanel(80, 40),
      mkPanel(100, 30),
    ]);

    expect(layout.dpr).toBe(2);
    expect(layout.chartWidth).toBe(1000);
    expect(layout.chartHeight).toBe(600);

    expect(layout.drawingAreaX).toBe(100);
    expect(layout.drawingAreaX1).toBe(960);
    expect(layout.drawingAreaWidth).toBe(860);

    expect(layout.drawingAreaHeight).toBe(540);
    expect(layout.drawingAreaY1).toBe(540);

    expect(layout.drawingAreaRight).toBe(40);
    expect(layout.drawingAreaBottom).toBe(60);
  });

  it('uses full chart height when xAxis is disabled', () => {
    const chartConfig = {
      backgroundColor: 'white',
      borders: null,
      grid: null,
      crosshairs: null,
      xAxis: null,
    } as ChartConfigComplete;

    const layout = getLayout(500, 300, 1, chartConfig, [mkPanel(20, 10)]);

    expect(layout.drawingAreaX).toBe(20);
    expect(layout.drawingAreaX1).toBe(490);
    expect(layout.drawingAreaHeight).toBe(300);
    expect(layout.drawingAreaBottom).toBe(0);
  });
});
