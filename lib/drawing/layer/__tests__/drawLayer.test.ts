import { describe, expect, it, vi } from 'vitest';

const drawMock = vi.hoisted(() => vi.fn());
vi.mock('../../../layers/layers', () => ({
  default: {
    line: { draw: drawMock },
    bar: {},
  },
}));

import drawLayer from '../drawLayer';

describe('drawLayer', () => {
  it('calls layer renderer when available', () => {
    drawLayer(
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      { type: 'line' } as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
    );
    expect(drawMock).toHaveBeenCalled();
  });

  it('skips when renderer missing', () => {
    drawMock.mockClear();
    drawLayer(
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      { type: 'bar' } as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
    );
    expect(drawMock).not.toHaveBeenCalled();
  });
});
