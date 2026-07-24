import { describe, expect, it } from 'vitest';
import { createMockContext } from '../../__tests__/testContext';
import drawChartWatermark from '../watermark/drawChartWatermark';

describe('chart watermark drawing', () => {
  it('does not draw when watermark config is disabled', () => {
    const ctx = createMockContext();

    drawChartWatermark(
      ctx,
      { drawingAreaY: 0, drawingAreaY1: 200 } as never,
      { watermark: null } as never,
    );

    expect(ctx.fill).not.toHaveBeenCalled();
  });

  it('draws the website logo above the bottom axis area', () => {
    const ctx = createMockContext();

    drawChartWatermark(
      ctx,
      { drawingAreaY: 0, drawingAreaY1: 200 } as never,
      {
        watermark: {
          color: 'white',
          opacity: 0.12,
          width: 60,
          height: 46,
          paddingLeft: 16,
          paddingBottom: 20,
        },
      } as never,
    );

    expect(ctx.save).toHaveBeenCalled();
    expect(ctx.translate).toHaveBeenCalledWith(16, 134);
    expect(ctx.scale).toHaveBeenCalledWith(1, 1);
    expect(ctx.rotate).toHaveBeenCalledWith(Math.PI / 8);
    expect(ctx.quadraticCurveTo).toHaveBeenCalled();
    expect(ctx.fill).toHaveBeenCalled();
    expect(ctx.restore).toHaveBeenCalled();
    expect(ctx.fillStyle).toBe('white');
    expect(ctx.globalAlpha).toBe(0.12);
  });
});
