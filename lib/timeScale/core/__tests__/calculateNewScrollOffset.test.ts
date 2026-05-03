import { describe, expect, it } from 'vitest';
import calculateNewScrollOffset from '../calculateNewScrollOffset';

describe('calculateNewScrollOffset', () => {
  const indexToTimestamp = (index: number) => index * 1000;
  const findClosestIndex = (timestamp: number) => Math.round(timestamp / 1000) + 1;

  it('applies delta and optional clamping', () => {
    expect(calculateNewScrollOffset(10, 5, indexToTimestamp, findClosestIndex, 10, 100)).toBe(15);
    expect(calculateNewScrollOffset(10, 50, indexToTimestamp, findClosestIndex, 10, 100, undefined, false, 0, 40)).toBe(40);
  });

  it('re-centers on granularity change', () => {
    const next = calculateNewScrollOffset(50, 5, indexToTimestamp, findClosestIndex, 20, 100, 10, true);
    expect(next).toBe(175);
  });

  it('re-centers on interval size change', () => {
    const next = calculateNewScrollOffset(50, -3, indexToTimestamp, findClosestIndex, 20, 100, 10, false);
    expect(next).toBe(147);
  });
});
