import { describe, expect, it } from 'vitest';
import drawValueGridLabelsElements from '../drawValueGridLabels';
import drawValueGridLabelsLegacy from '../../../../labels/valueLabel/drawValueGridLabels';
import { createMockContext } from '../../../../__tests__/testContext';

const baseArgs = () => ({
  layout: { drawingAreaX: 100, drawingAreaX1: 300 } as never,
  chartConfig: {} as never,
  panelConfig: {} as never,
  layerConfig: {
    yAxis: {
      side: 'left',
      width: 40,
      labels: {
        color: '#111',
        fontFamily: 'sans',
        fontSize: 12,
        fontWeight: '400',
        fontVariant: 'normal',
        fontStyle: 'normal',
        padding: 4,
      },
    },
    valueLabelFormatter: (v: number) => `v:${v}`,
  } as never,
  valueGridLines: [{ value: 1, y: 8 }, { value: 2, y: 60 }] as never,
  panelMetrics: { topPx: 10, bottomPx: 100 } as never,
  panelYAxis: { offsetPx: 10 } as never,
});

describe('drawValueGridLabels variants', () => {
  it('skips when yAxis config is missing', () => {
    const ctx = createMockContext();
    const args = baseArgs();
    args.layerConfig = { valueLabelFormatter: (v: number) => `${v}` } as never;

    drawValueGridLabelsElements(ctx, args.layout, args.chartConfig, args.panelConfig, args.layerConfig, args.valueGridLines, args.panelMetrics, args.panelYAxis);
    expect(ctx.fillText).not.toHaveBeenCalled();
  });

  it('draws visible labels for both module paths', () => {
    const ctx = createMockContext();
    const args = baseArgs();

    drawValueGridLabelsElements(ctx, args.layout, args.chartConfig, args.panelConfig, args.layerConfig, args.valueGridLines, args.panelMetrics, args.panelYAxis);
    drawValueGridLabelsLegacy(ctx, args.layout, args.chartConfig, args.panelConfig, args.layerConfig, args.valueGridLines, args.panelMetrics, args.panelYAxis);

    expect(ctx.fillText).toHaveBeenCalledWith('v:2', 54, 60);
    expect(ctx.fillText).toHaveBeenCalledTimes(2);
  });
});
