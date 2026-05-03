import { describe, expect, it } from 'vitest';
import drawBorders from '../borders/drawBorders';
import { createMockContext } from '../../__tests__/testContext';

describe('drawBorders', () => {
  it('skips when borders config absent', () => {
    const ctx = createMockContext();
    drawBorders(ctx, { drawingAreaX: 0, drawingAreaX1: 10, drawingAreaY: 0, drawingAreaY1: 10 } as never, {} as never);
    expect(ctx.stroke).not.toHaveBeenCalled();
  });

  it('draws continuous path for matching border styles', () => {
    const ctx = createMockContext();
    const line = { color: '#000', style: 'solid', width: 1 };
    drawBorders(
      ctx,
      { drawingAreaX: 0, drawingAreaX1: 10, drawingAreaY: 0, drawingAreaY1: 10 } as never,
      { borders: { left: line, right: line, top: line, bottom: line } } as never,
    );

    expect(ctx.stroke).toHaveBeenCalledTimes(1);
    expect(ctx.setLineDash).toHaveBeenCalledWith([]);
  });
});
