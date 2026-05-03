import { describe, expect, it, vi } from 'vitest';
import { createMockContext } from '../../../../drawing/__tests__/testContext';

const wickMock = vi.hoisted(() => vi.fn());
const bodyMock = vi.hoisted(() => vi.fn());
vi.mock('../drawCandleWick', () => ({ default: wickMock }));
vi.mock('../drawCandleBody', () => ({ default: bodyMock }));

import drawCandlestick from '../drawCandlestick';

describe('drawCandlestick', () => {
  it('delegates to wick/body with direction key', () => {
    drawCandlestick(
      createMockContext(),
      {} as never,
      {} as never,
      8,
      (v) => v,
      1,
      3,
      0,
      2,
      10,
      123,
    );

    expect(wickMock).toHaveBeenCalledWith(expect.anything(), expect.anything(), 'up', 10, 3, 0);
    expect(bodyMock).toHaveBeenCalledWith(expect.anything(), expect.anything(), 'up', 10, 1, 2, 8);
  });
});
