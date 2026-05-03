import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import useDevicePixelRatio from '../useDevicePixelRatio';

describe('useDevicePixelRatio', () => {
  const originalMatchMedia = window.matchMedia;
  const originalDpr = window.devicePixelRatio;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    Object.defineProperty(window, 'devicePixelRatio', {
      configurable: true,
      value: originalDpr,
    });
    vi.restoreAllMocks();
  });

  it('tracks DPR using matchMedia change + resize listeners', () => {
    let changeHandler: (() => void) | undefined;
    const mq = {
      matches: true,
      media: '(resolution: 1dppx)',
      onchange: null,
      addEventListener: vi.fn((_type: string, cb: () => void) => { changeHandler = cb; }),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };

    window.matchMedia = vi.fn(() => mq as unknown as MediaQueryList);
    Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: 1 });

    const { result, unmount } = renderHook(() => useDevicePixelRatio());
    expect(result.current).toBe(1);
    expect(mq.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));

    Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: 2 });
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    expect(result.current).toBe(2);

    Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: 3 });
    act(() => {
      changeHandler?.();
    });
    expect(result.current).toBe(3);

    unmount();
    expect(mq.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('falls back to addListener/removeListener when addEventListener is unavailable', () => {
    const mq = {
      matches: true,
      media: '(resolution: 1dppx)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };

    window.matchMedia = vi.fn(() => mq as unknown as MediaQueryList);

    const { unmount } = renderHook(() => useDevicePixelRatio());
    expect(mq.addListener).toHaveBeenCalledWith(expect.any(Function));

    unmount();
    expect(mq.removeListener).toHaveBeenCalledWith(expect.any(Function));
  });
});
