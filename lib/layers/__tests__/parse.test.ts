import { describe, expect, it } from 'vitest';
import defaultLightTheme from '../../themes/defaultLightTheme';
import parseArea from '../area/parse';
import parseCandlesticks from '../candlesticks/parse';
import parseAtr from '../atr/parse';
import parseBollingerBands from '../bollingerBands/parse';
import parseMacd from '../macd/parse';
import parseOhlcBars from '../ohlcBars/parse';
import parsePriceLine from '../priceLine/parse';
import parseSma from '../sma/parse';
import parseStochastic from '../stochastic/parse';
import parseVolumeBars from '../volumeBars/parse';
import parseAdx from '../adx/parse';
import parseCci from '../cci/parse';
import parseObv from '../obv/parse';
import parseParabolicSar from '../parabolicSar/parse';
import parseWilliamsR from '../williamsR/parse';

describe('layer config parsers', () => {
  const layersTheme = defaultLightTheme.layers;

  it('parses candlestick config with defaults', () => {
    const cfg = parseCandlesticks({ type: 'price:candlesticks' }, layersTheme as never, 'p1');
    expect(cfg.id).toBe('candlestick-layer_p1');
    expect(cfg.type).toBe('price:candlesticks');
    expect(cfg.scalePolicy).toBe('fixed');
    expect(cfg.requiredInputKeys).toEqual(['open', 'high', 'low', 'close']);
  });

  it('parses ohlc bars config with directional colours', () => {
    const cfg = parseOhlcBars({
      type: 'price:ohlc-bars',
      series: {
        bars: {
          up: { backgroundColor: '#0f0', borderColor: '#0f0' },
          down: { backgroundColor: '#f00', borderColor: '#f00' },
        },
      },
    }, layersTheme as never, 'p1b');

    expect(cfg.id).toBe('ohlc-bars-layer_p1b');
    expect(cfg.type).toBe('price:ohlc-bars');
    expect(cfg.requiredInputKeys).toEqual(['open', 'high', 'low', 'close']);
    expect(cfg.series.bars?.up.backgroundColor).toBe('#0f0');
    expect(cfg.series.bars?.down.backgroundColor).toBe('#f00');
    expect(cfg.outputs).toEqual(['open', 'high', 'low', 'close']);
  });

  it('parses price line config and builds default legend label', () => {
    const cfg = parsePriceLine({ type: 'price:line' }, layersTheme as never, 'p2');
    expect(cfg.id).toBe('price-line_p2');
    expect(cfg.type).toBe('price:line');
    expect(cfg.legend?.label).toBe('Price');
    expect(cfg.outputs).toEqual(['price']);
  });

  it('parses area config with line and gradient fill colours', () => {
    const cfg = parseArea({
      type: 'price:area',
      series: {
        value: {
          line: { color: '#123' },
          fill: { topColor: '#1234', bottomColor: 'transparent' },
        },
      },
    }, layersTheme as never, 'p2a');

    expect(cfg.id).toBe('area-layer_p2a');
    expect(cfg.type).toBe('price:area');
    expect(cfg.legend?.label).toBe('Price');
    expect(cfg.series.value.line?.color).toBe('#123');
    expect(cfg.series.value.fill?.topColor).toBe('#1234');
    expect(cfg.series.value.fill?.bottomColor).toBe('transparent');
    expect(cfg.outputs).toEqual(['price']);
  });

  it('parses sma config with period-derived id and lookback', () => {
    const cfg = parseSma({ type: 'sma', period: 10, series: { value: { color: 'red' } } }, layersTheme as never, 'p3');
    expect(cfg.id).toBe('sma-layer_p3_10');
    expect(cfg.indicator).toBe(true);
    expect(cfg.lookback).toBe(10);
    expect(cfg.scalePolicy).toBe('derived');
  });

  it('parses sma source shorthand when inputs are omitted', () => {
    const cfg = parseSma({ type: 'sma', source: 'open' }, layersTheme as never, 'p3s');
    expect(cfg.inputs).toEqual([{ key: 'input', source: { type: 'price', field: 'open' } }]);
  });

  it('parses atr source shorthand for high/low/close inputs', () => {
    const cfg = parseAtr({
      type: 'atr',
      source: { high: 'open', low: 'low', close: 'volume' },
    }, layersTheme as never, 'p3a');
    expect(cfg.inputs).toEqual([
      { key: 'high', source: { type: 'price', field: 'open' } },
      { key: 'low', source: { type: 'price', field: 'low' } },
      { key: 'close', source: { type: 'volume', field: 'volume' } },
    ]);
    expect(cfg.defaultScale).toEqual({ key: 'value_auto', domain: 'value', range: { type: 'auto' } });
    expect(cfg.series.value).toBeTruthy();
    expect(cfg.lookback).toBe(42);
  });

  it('parses adx config with viewport-based automatic scaling', () => {
    const cfg = parseAdx({
      type: 'adx',
      diLength: 10,
      smoothing: 7,
      series: { value: { color: 'blue' } },
    }, layersTheme as never, 'p3d');

    expect(cfg.id).toBe('adx-layer_p3d_10_7');
    expect(cfg.diLength).toBe(10);
    expect(cfg.smoothing).toBe(7);
    expect(cfg.period).toBe(10);
    expect(cfg.defaultScale).toEqual({ key: 'value_auto', domain: 'value', range: { type: 'auto' } });
    expect(cfg.scalePolicy).toBe('derived');
    expect(cfg.valueGridLines).toBeUndefined();
    expect(cfg.outputs).toEqual(['value']);
    expect(cfg.series.value?.color).toBe('blue');
    expect(cfg.legend?.label).toBe('ADX 10 7');
  });

  it('validates adx lengths', () => {
    expect(() => parseAdx({ type: 'adx', diLength: 0 }, layersTheme as never, 'p3e')).toThrow('adx.diLength must be > 0');
    expect(() => parseAdx({ type: 'adx', smoothing: 0 }, layersTheme as never, 'p3e')).toThrow('adx.smoothing must be > 0');
  });

  it('parses stochastic config with derived id and fixed value grid lines', () => {
    const cfg = parseStochastic({
      type: 'stochastic',
      kPeriod: 14,
      kSmoothing: 3,
      dPeriod: 3,
      series: { k: { color: '#111' }, d: { color: '#222' } },
    }, layersTheme as never, 'p4');
    expect(cfg.id).toBe('stochastic-layer_p4_14_3_3');
    expect(cfg.kPeriod).toBe(14);
    expect(cfg.period).toBe(14);
    expect(cfg.scalePolicy).toBe('expandable');
    expect(cfg.valueGridLines).toEqual([20, 80]);
    expect(cfg.outputs).toEqual(['k', 'kSmoothed', 'd']);
    expect(cfg.series.k?.color).toBe('#111');
    expect(cfg.series.d?.color).toBe('#222');
    expect(cfg.lookback).toBe(17);
  });

  it('parses macd config with fastPeriod and maintains period alias', () => {
    const cfg = parseMacd({ type: 'macd', fastPeriod: 10, slowPeriod: 21, signalPeriod: 8 }, layersTheme as never, 'p5');
    expect(cfg.id).toBe('macd-layer_p5_10_21_8');
    expect(cfg.fastPeriod).toBe(10);
    expect(cfg.period).toBe(10);
    expect(cfg.scalePolicy).toBe('expandable');
    expect(cfg.outputs).toEqual(['macd', 'signal', 'histogram']);
  });

  it('parses bollinger bands with price auto scale by default', () => {
    const cfg = parseBollingerBands({ type: 'bollinger-bands' }, layersTheme as never, 'p5b');
    expect(cfg.defaultScale).toEqual({ key: 'price_auto', domain: 'price', range: { type: 'auto' } });
    expect(cfg.outputs).toEqual(['middle', 'upper', 'lower']);
    expect(cfg.lookback).toBe(20);
  });

  it('parses macd series and markers visual configs', () => {
    const cfg = parseMacd({
      type: 'macd',
      series: {
        macd: { color: 'blue' },
        signal: false,
        histogramUp: { width: 0.6 },
        histogramDown: false,
      },
      markers: {
        macd: { label: { backgroundColor: 'blue' } },
        signal: false,
      },
    }, layersTheme as never, 'p5v');
    expect(cfg.series.macd?.color).toBe('blue');
    expect(cfg.series.signal).toBeNull();
    expect(cfg.series.histogramUp?.width).toBe(0.6);
    expect(cfg.series.histogramDown).toBeNull();
    expect(cfg.markers.macd?.label?.backgroundColor).toBe('blue');
    expect(cfg.markers.signal).toBeNull();
  });

  it('prefers explicit inputs over source shorthand', () => {
    const cfg = parseMacd({
      type: 'macd',
      source: 'open',
      inputs: [{ key: 'input', source: { type: 'price', field: 'close' } }],
    }, layersTheme as never, 'p5i');
    expect(cfg.inputs).toEqual([{ key: 'input', source: { type: 'price', field: 'close' } }]);
  });

  it('parses volume bars config with defaults', () => {
    const cfg = parseVolumeBars({ type: 'volume:bars' }, layersTheme as never, 'p6');
    expect(cfg.id).toBe('volume-bars-layer_p6');
    expect(cfg.type).toBe('volume:bars');
    expect(cfg.legend?.label).toBe('Volume');
    expect(cfg.outputs).toEqual(['volume']);
  });

  it('parses the new indicator configs and source shorthand', () => {
    const psar = parseParabolicSar({
      type: 'parabolic-sar',
      source: { high: 'close', low: 'open' },
    }, layersTheme as never, 'p7');
    expect(psar).toMatchObject({
      type: 'parabolic-sar',
      start: 0.02,
      increment: 0.02,
      maxValue: 0.2,
      lookback: 0,
      inputs: [
        { key: 'high', source: { type: 'price', field: 'close' } },
        { key: 'low', source: { type: 'price', field: 'open' } },
      ],
    });

    const obv = parseObv({ type: 'obv', source: 'open' }, layersTheme as never, 'p8');
    expect(obv.smoothingLength).toBe(14);
    expect(obv.lookback).toBe(0);
    expect(obv.inputs).toEqual([
      { key: 'price', source: { type: 'price', field: 'open' } },
      { key: 'volume', source: { type: 'volume', field: 'volume' } },
    ]);

    const cci = parseCci({ type: 'cci', length: 10, smoothingLength: 3 }, layersTheme as never, 'p9');
    expect(cci).toMatchObject({
      length: 10,
      smoothingLength: 3,
      period: 10,
      lookback: 11,
      outputs: ['value', 'smoothing'],
      valueGridLines: [-100, 100],
    });

    const williamsR = parseWilliamsR({ type: 'williams-r', length: 10 }, layersTheme as never, 'p10');
    expect(williamsR).toMatchObject({
      length: 10,
      period: 10,
      lookback: 10,
      valueGridLines: [-80, -20],
      defaultScale: { range: { type: 'bounded', min: -100, max: 0 } },
    });
  });

  it('validates the new indicator parameters', () => {
    expect(() => parseParabolicSar({ type: 'parabolic-sar', start: 0.3, maxValue: 0.2 }, layersTheme as never, 'p11'))
      .toThrow('parabolic-sar.start must be <= parabolic-sar.maxValue');
    expect(() => parseObv({ type: 'obv', smoothingLength: 0 }, layersTheme as never, 'p11'))
      .toThrow('obv.smoothingLength must be > 0');
    expect(() => parseCci({ type: 'cci', length: 0 }, layersTheme as never, 'p11'))
      .toThrow('cci.length must be > 0');
    expect(() => parseWilliamsR({ type: 'williams-r', length: 0 }, layersTheme as never, 'p11'))
      .toThrow('williams-r.length must be > 0');
  });
});
