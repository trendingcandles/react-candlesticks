import { describe, expect, it } from 'vitest';
import { createMockContext } from '../../../../drawing/__tests__/testContext';
import drawCandleBody from '../drawCandleBody';
import drawCandleWick from '../drawCandleWick';
import debugEmptyCandle from '../_debugDrawEmptyCandle';

describe('candlestick draw primitives', () => {
  it('draws wick and body variants', () => {
    const ctx = createMockContext();
    drawCandleWick(ctx, { series: { wick: { up: { width: 1, color: '#0f0' } } } } as never, 'up', 10, 5, 20);
    expect(ctx.moveTo).toHaveBeenCalledWith(10.5, 5);
    expect(ctx.lineTo).toHaveBeenCalledWith(10.5, 20);

    drawCandleBody(
      ctx,
      { series: { body: { up: { width: 0.6, borderWidth: 1, backgroundColor: '#0f0', borderColor: '#080' } } } } as never,
      'up',
      10,
      30,
      20,
      10,
    );
    expect(ctx.fillRect).toHaveBeenCalled();
  });

  it('draws doji body as a line when open equals close', () => {
    const ctx = createMockContext();
    drawCandleBody(
      ctx,
      { series: { body: { flat: { width: 0.6, borderWidth: 0, backgroundColor: '#999', borderColor: '#999' } } } } as never,
      'flat',
      10,
      20,
      20,
      10,
    );

    expect(ctx.beginPath).toHaveBeenCalled();
    expect(ctx.moveTo).toHaveBeenCalled();
    expect(ctx.stroke).toHaveBeenCalled();
  });

  it('draws debug empty candle rectangle', () => {
    const ctx = createMockContext();
    debugEmptyCandle(ctx, 20, 10, 100);
    expect(ctx.fillRect).toHaveBeenCalledWith(14, 50, 8, 48);
  });
});
