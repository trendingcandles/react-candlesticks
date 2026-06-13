import { describe, expect, it, vi } from 'vitest';
import draw from '../draw';

describe('parabolic sar draw', () => {
  it('positions dots using the same scroll translation as candlesticks', () => {
    const context = {
      save: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      fillStyle: '',
    };
    const values = new Float64Array([Number.NaN, Number.NaN, 25, 30]);

    draw(
      context as never,
      {} as never,
      {} as never,
      {} as never,
      {
        id: 'psar',
        series: { value: { color: 'blue', width: 1 } },
      } as never,
      {} as never,
      {
        timeScale: {
          metadata: { intervalSize: 10, scrollOffset: 15 },
          startBarIndex: 2,
          endBarIndex: 3,
        },
        layersData: {
          layerDataInstances: {
            psar: { outputValues: { value: values } },
          },
        },
      } as never,
      {} as never,
      {} as never,
      { valueToY: (value: number) => value * 2 } as never,
    );

    expect(context.arc).toHaveBeenNthCalledWith(1, 5, 50, 1.5, 0, Math.PI * 2);
    expect(context.arc).toHaveBeenNthCalledWith(2, 15, 60, 1.5, 0, Math.PI * 2);
  });
});
