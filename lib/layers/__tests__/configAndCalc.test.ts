import { describe, expect, it } from 'vitest';
import { REQUIRED_INPUT_KEYS as C_KEYS, candlestickLayerDefaults } from '../candlesticks/CandlestickLayerConfig';
import { REQUIRED_INPUT_KEYS as P_KEYS, priceLineLayerDefaults } from '../priceLine/PriceLineLayerConfig';
import { REQUIRED_INPUT_KEYS as S_KEYS, smaDefaults } from '../sma/SmaLayerConfig';
import { REQUIRED_INPUT_KEYS as ST_KEYS, stochasticDefaults } from '../stochastic/StochasticLayerConfig';
import { REQUIRED_INPUT_KEYS as V_KEYS, volumeBarsDefaults } from '../volumeBars/VolumeBarsLayerConfig';
import { REQUIRED_INPUT_KEYS as ADX_KEYS, adxDefaults } from '../adx/AdxLayerConfig';
import adxCalc from '../adx/calc';
import candlestickCalc from '../candlesticks/calc';
import priceLineCalc from '../priceLine/calc';
import smaCalc from '../sma/calc';
import stochasticCalc from '../stochastic/calc';
import volumeBarsCalc from '../volumeBars/calc';

describe('layer config defaults', () => {
  it('exports required input keys and defaults', () => {
    expect(C_KEYS).toEqual(['open', 'high', 'low', 'close']);
    expect(P_KEYS).toEqual(['input']);
    expect(S_KEYS).toEqual(['input']);
    expect(ST_KEYS).toEqual(['high', 'low', 'close']);
    expect(V_KEYS).toEqual(['volume']);
    expect(ADX_KEYS).toEqual(['high', 'low', 'close']);

    expect(candlestickLayerDefaults.id).toBe('candlestick-layer');
    expect(priceLineLayerDefaults.id).toBe('price-line');
    expect(smaDefaults.period).toBe(50);
    expect(stochasticDefaults.kSmoothing).toBe(3);
    expect(volumeBarsDefaults.id).toBe('volume-bars-layer');
    expect(adxDefaults.diLength).toBe(14);
    expect(adxDefaults.smoothing).toBe(14);
  });

  it('valueToY default projections return expected values', () => {
    expect(candlestickLayerDefaults.valueToY(0, 100, 10, 50)(100)).toBe(10);
    expect(priceLineLayerDefaults.valueToY(0, 100, 10, 50)(0)).toBe(60);
    expect(smaDefaults.valueToY(0, 100, 10, 50)(50)).toBe(35);
    expect(stochasticDefaults.valueToY(0, 100, 10, 50)(0)).toBe(60);
    expect(volumeBarsDefaults.valueToY(0, 100, 10, 50)(100)).toBe(10);
    expect(adxDefaults.valueToY(0, 100, 10, 50)(25)).toBe(47.5);
  });
});

describe('layer calc functions', () => {
  it('maps direct outputs for candlestick/price/volume layers', () => {
    const open = new Float64Array([1, 2]);
    const high = new Float64Array([3, 4]);
    const low = new Float64Array([0, 1]);
    const close = new Float64Array([2, 3]);
    const volume = new Float64Array([10, 20]);

    const out1: Record<string, Float64Array> = {};
    candlestickCalc({} as never, { open: { values: open }, high: { values: high }, low: { values: low }, close: { values: close } } as never, out1, 0, 2);
    expect(out1.open).toBe(open);
    expect(out1.high).toBe(high);
    expect(out1.low).toBe(low);
    expect(out1.close).toBe(close);

    const out2: Record<string, Float64Array> = {};
    priceLineCalc({} as never, { input: { values: close } } as never, out2, 0, 2);
    expect(out2.price).toBe(close);

    const out3: Record<string, Float64Array> = {};
    volumeBarsCalc({} as never, { volume: { values: volume } } as never, out3, 0, 2);
    expect(out3.volume).toBe(volume);
  });

  it('computes SMA and stochastic values with lookback windows', () => {
    const input = new Float64Array([1, 2, 3, 4, 5]);
    const smaOut = new Float64Array(5);
    smaOut.fill(Number.NaN);

    smaCalc({ period: 3 } as never, { input: { values: input } } as never, { value: smaOut }, 0, 5);
    expect(smaOut[2]).toBeCloseTo(2);
    expect(smaOut[4]).toBeCloseTo(4);

    const highs = new Float64Array([1, 2, 3, 4, 5]);
    const lows = new Float64Array([0, 1, 2, 3, 4]);
    const closes = new Float64Array([0.5, 1.5, 2.5, 3.5, 4.5]);
    const k = new Float64Array(5); k.fill(Number.NaN);
    const kSmoothed = new Float64Array(5); kSmoothed.fill(Number.NaN);
    const d = new Float64Array(5); d.fill(Number.NaN);

    stochasticCalc(
      { period: 3, kSmoothing: 2, dPeriod: 2 } as never,
      { high: { values: highs }, low: { values: lows }, close: { values: closes } } as never,
      { k, kSmoothed, d },
      0,
      5,
    );

    expect(k[2]).toBeCloseTo(83.333, 2);
    expect(kSmoothed[3]).toBeCloseTo(83.333, 2);
    expect(d[4]).toBeCloseTo(83.333, 2);
  });

  it('computes ADX with independent DI length and smoothing', () => {
    const high = new Float64Array([10, 11, 13, 14, 16, 17, 19]);
    const low = new Float64Array([8, 9, 10, 11, 13, 14, 16]);
    const close = new Float64Array([9, 10, 12, 13, 15, 16, 18]);
    const value = new Float64Array(high.length); value.fill(Number.NaN);

    adxCalc(
      { diLength: 3, smoothing: 2 } as never,
      { high: { values: high }, low: { values: low }, close: { values: close } } as never,
      { value },
      0,
      high.length,
    );

    expect(Number.isNaN(value[3])).toBe(true);
    expect(value[4]).toBeCloseTo(100);
    expect(value[6]).toBeCloseTo(100);
  });
});
