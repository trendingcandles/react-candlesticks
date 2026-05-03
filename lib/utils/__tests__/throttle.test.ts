/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { describe, it, expect, vi } from 'vitest';
import throttle from '../throttle';

describe('throttle', () => {
  it('calls function immediately on first call', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);
    throttled('a');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('a');
  });

  it('throttles subsequent calls within the limit', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled('a'); // should call immediately
    throttled('b'); // should be stored and executed later
    throttled('c'); // overwrites previous args

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('a');

    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledWith('c'); // last args win

    vi.useRealTimers();
  });

  it('does not call stored args if no extra calls were made', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled('a');
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100); // no further call

    expect(fn).toHaveBeenCalledTimes(1); // still just the first call

    vi.useRealTimers();
  });

  it('calls function again after throttle period with new args', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled('a'); // immediate
    vi.advanceTimersByTime(100); // clears throttle

    throttled('b'); // should call immediately again
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith('b');

    vi.useRealTimers();
  });
});
