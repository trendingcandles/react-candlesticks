import { describe, expect, it } from 'vitest';
import layers from '../layers';
import candlesticks from '../candlesticks';
import priceLine from '../priceLine';
import sma from '../sma';
import stochastic from '../stochastic';
import volumeBars from '../volumeBars';
import adx from '../adx';
import { ADX, Candlesticks, PriceLine, SMA, Stochastic, VolumeBars } from '../index';

describe('layer exports', () => {
  it('maps layer types to layer implementations', () => {
    expect(layers['price:candlesticks']).toBe(candlesticks);
    expect(layers['price:line']).toBe(priceLine);
    expect(layers.sma).toBe(sma);
    expect(layers.stochastic).toBe(stochastic);
    expect(layers['volume:bars']).toBe(volumeBars);
    expect(layers.adx).toBe(adx);
  });

  it('exports React layer components', () => {
    expect(Candlesticks({} as never)).toBeNull();
    expect(PriceLine({} as never)).toBeNull();
    expect(SMA({} as never)).toBeNull();
    expect(Stochastic({} as never)).toBeNull();
    expect(VolumeBars({} as never)).toBeNull();
    expect(ADX({} as never)).toBeNull();
  });

  it('layer modules expose parse/calc/draw hooks', () => {
    expect(typeof candlesticks.parseConfig).toBe('function');
    expect(typeof priceLine.calculate2).toBe('function');
    expect(typeof sma.draw).toBe('function');
    expect(typeof stochastic.calculate2).toBe('function');
    expect(typeof volumeBars.parseConfig).toBe('function');
    expect(typeof adx.calculate2).toBe('function');
  });
});
