import { describe, expect, it } from 'vitest';
import defaultLightTheme from '../../themes/defaultLightTheme';
import parseCandlesticks from '../candlesticks/parse';
import parseAtr from '../atr/parse';
import parseBollingerBands from '../bollingerBands/parse';
import parseMacd from '../macd/parse';
import parsePriceLine from '../priceLine/parse';
import parseSma from '../sma/parse';
import parseStochastic from '../stochastic/parse';
import parseVolumeBars from '../volumeBars/parse';

describe('layer config parsers', () => {
  const layersTheme = defaultLightTheme.layers;

  it('parses candlestick config with defaults', () => {
    const cfg = parseCandlesticks({ type: 'price:candlesticks' }, layersTheme as never, 'p1');
    expect(cfg.id).toBe('candlestick-layer_p1');
    expect(cfg.type).toBe('price:candlesticks');
    expect(cfg.scalePolicy).toBe('fixed');
    expect(cfg.requiredInputKeys).toEqual(['open', 'high', 'low', 'close']);
  });

  it('parses price line config and builds default legend label', () => {
    const cfg = parsePriceLine({ type: 'price:line' }, layersTheme as never, 'p2');
    expect(cfg.id).toBe('price-line_p2');
    expect(cfg.type).toBe('price:line');
    expect(cfg.legend?.label).toBe('Price');
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
});
