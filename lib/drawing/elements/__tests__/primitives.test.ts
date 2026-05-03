import { describe, expect, it } from 'vitest';
import drawBar from '../drawBar';
import startDrawLine from '../line/startDrawLine';
import drawLine from '../line/drawLine';
import endDrawLine from '../line/endDrawLine';
import drawTimeGridLabel from '../labels/timeLabel/drawTimeGridLabel';
import { createMockContext } from '../../__tests__/testContext';

describe('drawing element primitives', () => {
  it('draws bars with and without border', () => {
    const ctx = createMockContext();
    drawBar(ctx, (v) => v, 10, 20, 5, 10, { backgroundColor: 'blue', borderColor: 'red', borderWidth: 1 } as never);
    expect(ctx.fillRect).toHaveBeenCalledTimes(2);

    const ctx2 = createMockContext();
    drawBar(ctx2, (v) => v, 10, 20, 5, 10, { backgroundColor: 'blue', borderColor: 'red', borderWidth: 0 } as never);
    expect(ctx2.fillRect).toHaveBeenCalledTimes(1);
  });

  it('draws line start, continuation and end dot', () => {
    const ctx = createMockContext();
    const y0 = startDrawLine(ctx, (v) => v + 1, 5, 10, { color: '#000', width: 2, style: 'dashed', dashes: [2, 2] } as never);
    const y1 = drawLine(ctx, (v) => v + 1, 6, 20);
    endDrawLine(ctx, (v) => v + 1, 6, 20, { style: 'dashed', color: '#000', endDotSize: 2 } as never, true);

    expect(y0).toBe(6);
    expect(y1).toBe(7);
    expect(ctx.setLineDash).toHaveBeenCalledWith([2, 2]);
    expect(ctx.lineTo).toHaveBeenCalledWith(20, 7);
    expect(ctx.ellipse).toHaveBeenCalled();
    expect(ctx.setLineDash).toHaveBeenCalledWith([]);
  });

  it('draws time grid label with major weight and formatter payload', () => {
    const ctx = createMockContext();
    const formatter = (args: { kind: string; timeUnit: string; utcTs: number }) => `${args.kind}-${args.timeUnit}-${args.utcTs}`;

    drawTimeGridLabel(
      ctx,
      50,
      10,
      { major: true, step: { unit: 'hour' } } as never,
      123,
      {
        top: 6,
        color: '#111',
        fontFamily: 'sans',
        fontSize: 12,
        fontStyle: 'normal',
        fontVariant: 'normal',
        fontWeight: '400',
        formatter,
      } as never,
      'UTC',
    );

    expect(ctx.fillText).toHaveBeenCalledWith('major-hour-123', 10, 56);
    expect(ctx.font).toContain('bold');
  });
});
