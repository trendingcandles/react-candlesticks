import { describe, expect, it } from 'vitest';
import { createMockContext } from '../../../../drawing/__tests__/testContext';
import drawVolumeBar from '../drawVolumeBar';

describe('drawVolumeBar', () => {
  it('draws bordered bar and inner fill when dimensions are valid', () => {
    const ctx = createMockContext();
    drawVolumeBar(
      ctx,
      {
        series: {
          bars: {
            up: { width: 0.6, borderWidth: 1, backgroundColor: '#0f0', borderColor: '#070' },
          },
        },
      } as never,
      'up',
      10,
      5,
      25,
      10,
    );

    expect(ctx.fillRect).toHaveBeenCalledTimes(2);
  });

  it('draws simple fill when border width is zero', () => {
    const ctx = createMockContext();
    drawVolumeBar(
      ctx,
      {
        series: {
          bars: {
            flat: { width: 0.6, borderWidth: 0, backgroundColor: '#999', borderColor: '#999' },
          },
        },
      } as never,
      'flat',
      10,
      5,
      15,
      10,
    );

    expect(ctx.fillRect).toHaveBeenCalledTimes(1);
  });
});
