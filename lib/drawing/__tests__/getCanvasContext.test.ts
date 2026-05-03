import { describe, expect, it, vi } from 'vitest';
import getCanvasContext from '../getCanvasContext';
import { createMockContext } from './testContext';

describe('getCanvasContext', () => {
  it('returns false for missing canvas or zero size', () => {
    const ref = { current: null } as React.RefObject<HTMLCanvasElement | null>;
    expect(getCanvasContext(ref, 100, 100, 2, null)).toBe(false);

    const canvas = document.createElement('canvas');
    const ref2 = { current: canvas } as React.RefObject<HTMLCanvasElement | null>;
    expect(getCanvasContext(ref2, 0, 100, 2, null)).toBe(false);
  });

  it('returns false when 2d context is unavailable', () => {
    const canvas = document.createElement('canvas');
    vi.spyOn(canvas, 'getContext').mockReturnValue(null);
    const ref = { current: canvas } as React.RefObject<HTMLCanvasElement | null>;

    expect(getCanvasContext(ref, 100, 100, 2, null)).toBe(false);
  });

  it('applies retina sizing when size changed and returns context', () => {
    const canvas = document.createElement('canvas');
    const ctx = createMockContext();
    vi.spyOn(canvas, 'getContext').mockReturnValue(ctx);
    const ref = { current: canvas } as React.RefObject<HTMLCanvasElement | null>;

    const result = getCanvasContext(ref, 100, 50, 2, { width: 90, height: 50, dpr: 2 });

    expect(result).toBe(ctx);
    expect(canvas.width).toBe(200);
    expect(canvas.height).toBe(100);
    expect(canvas.style.width).toBe('100px');
    expect(canvas.style.height).toBe('50px');
    expect(ctx.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 0, 0);
  });
});
