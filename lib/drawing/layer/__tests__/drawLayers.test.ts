import { describe, expect, it, vi } from 'vitest';

const drawLayerMock = vi.hoisted(() => vi.fn());
vi.mock('../drawLayer', () => ({ default: drawLayerMock }));
import drawLayers from '../drawLayers';

describe('drawLayers', () => {
  it('iterates all layers and delegates to drawLayer', () => {
    drawLayers(
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      [{ id: 'a' }, { id: 'b' }] as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
    );

    expect(drawLayerMock).toHaveBeenCalledTimes(2);
    expect(drawLayerMock.mock.calls[0][4]).toEqual({ id: 'a' });
  });
});
