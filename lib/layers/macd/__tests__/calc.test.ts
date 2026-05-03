import { describe, expect, it } from 'vitest';
import calc from '../calc';

describe('macd calc', () => {
  it('uses parsed fastPeriod and populates macd/signal/histogram', () => {
    const input = new Float64Array([1, 2, 3, 4, 5, 6, 7, 8]);
    const macd = new Float64Array(8); macd.fill(Number.NaN);
    const signal = new Float64Array(8); signal.fill(Number.NaN);
    const histogram = new Float64Array(8); histogram.fill(Number.NaN);

    calc(
      { fastPeriod: 2, period: 99, slowPeriod: 3, signalPeriod: 2 } as never,
      { input: { values: input } } as never,
      { macd, signal, histogram },
      0,
      8,
    );

    expect(Number.isNaN(macd[1])).toBe(true);
    expect(Number.isNaN(signal[1])).toBe(true);
    expect(macd[3]).toBeCloseTo(0.5, 3);
    expect(signal[4]).toBeCloseTo(0.5, 3);
    expect(histogram[5]).toBeCloseTo(0, 3);
  });

  it('skips NaN input values and leaves outputs unset for those bars', () => {
    const input = new Float64Array([1, 2, Number.NaN, 4, 5]);
    const macd = new Float64Array(5); macd.fill(Number.NaN);
    const signal = new Float64Array(5); signal.fill(Number.NaN);
    const histogram = new Float64Array(5); histogram.fill(Number.NaN);

    calc(
      { fastPeriod: 2, slowPeriod: 3, signalPeriod: 2 } as never,
      { input: { values: input } } as never,
      { macd, signal, histogram },
      0,
      5,
    );

    expect(Number.isNaN(macd[2])).toBe(true);
    expect(Number.isNaN(signal[2])).toBe(true);
    expect(Number.isNaN(histogram[2])).toBe(true);
  });
});
