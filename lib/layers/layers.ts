/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import Layer from '../config/layer/Layer';
import { LayerType } from '../config/layer/LayerType';
import candlesticks from './candlesticks';
import priceLine from './priceLine';
import volumeBars from './volumeBars';
import adx from './adx';
import atr from './atr';
import bollingerBands from './bollingerBands';
import ema from './ema';
import macd from './macd';
import rsi from './rsi';
import sma from './sma';
import stochastic from './stochastic';
import cci from './cci';
import obv from './obv';
import parabolicSar from './parabolicSar';
import williamsR from './williamsR';

const layers: Record<LayerType, Layer> = {
  'price:candlesticks': candlesticks,
  'price:line': priceLine,
  adx,
  atr,
  'bollinger-bands': bollingerBands,
  cci,
  ema,
  macd,
  obv,
  'parabolic-sar': parabolicSar,
  rsi,
  sma,
  stochastic,
  'williams-r': williamsR,
  'volume:bars': volumeBars,
};

export default layers;
