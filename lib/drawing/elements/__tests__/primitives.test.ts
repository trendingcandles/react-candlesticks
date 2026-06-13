import { describe, expect, it } from 'vitest';
import drawBar from '../drawBar';
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
