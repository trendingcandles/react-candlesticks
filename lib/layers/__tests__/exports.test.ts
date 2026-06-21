import { describe, expect, it } from 'vitest';
import layers from '../layers';
import area from '../area';
import candlesticks from '../candlesticks';
import ohlcBars from '../ohlcBars';
import priceLine from '../priceLine';
import sma from '../sma';
import stochastic from '../stochastic';
import volumeBars from '../volumeBars';
import adx from '../adx';
import cci from '../cci';
import obv from '../obv';
import parabolicSar from '../parabolicSar';
import williamsR from '../williamsR';
import builtInLayerDefinitions from '../builtInLayers';
import { ADX, Area, CCI, Candlesticks, OBV, OhlcBars, ParabolicSAR, PriceLine, SMA, Stochastic, VolumeBars, WilliamsR } from '../index';

describe('layer exports', () => {
  it('maps layer types to layer implementations', () => {
    expect(Object.keys(layers)).toHaveLength(builtInLayerDefinitions.length);
    expect(builtInLayerDefinitions.map(layer => layer.type)).toEqual(Object.keys(layers));
    expect(layers['price:candlesticks']).toBe(candlesticks);
    expect(layers['price:ohlc-bars']).toBe(ohlcBars);
    expect(layers['price:line']).toBe(priceLine);
    expect(layers['price:area']).toBe(area);
    expect(layers.sma).toBe(sma);
    expect(layers.stochastic).toBe(stochastic);
    expect(layers['volume:bars']).toBe(volumeBars);
    expect(layers.adx).toBe(adx);
    expect(layers.cci).toBe(cci);
    expect(layers.obv).toBe(obv);
    expect(layers['parabolic-sar']).toBe(parabolicSar);
    expect(layers['williams-r']).toBe(williamsR);
  });

  it('exports React layer components', () => {
    expect(Candlesticks).toBe(candlesticks.Component);
    expect(OhlcBars).toBe(ohlcBars.Component);
    expect(Area).toBe(area.Component);
    expect(SMA).toBe(sma.Component);
    expect(Candlesticks({} as never)).toBeNull();
    expect(OhlcBars({} as never)).toBeNull();
    expect(PriceLine({} as never)).toBeNull();
    expect(Area({} as never)).toBeNull();
    expect(SMA({} as never)).toBeNull();
    expect(Stochastic({} as never)).toBeNull();
    expect(VolumeBars({} as never)).toBeNull();
    expect(ADX({} as never)).toBeNull();
    expect(CCI({} as never)).toBeNull();
    expect(OBV({} as never)).toBeNull();
    expect(ParabolicSAR({} as never)).toBeNull();
    expect(WilliamsR({} as never)).toBeNull();
  });

  it('layer modules expose parse/calc/draw hooks', () => {
    expect(typeof candlesticks.parseConfig).toBe('function');
    expect(typeof ohlcBars.parseConfig).toBe('function');
    expect(typeof priceLine.calculate).toBe('function');
    expect(typeof area.draw).toBe('function');
    expect(typeof sma.draw).toBe('function');
    expect(typeof stochastic.calculate).toBe('function');
    expect(typeof volumeBars.parseConfig).toBe('function');
    expect(typeof adx.calculate).toBe('function');
  });
});
