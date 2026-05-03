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
import atr from './atr';
import bollingerBands from './bollingerBands';
import ema from './ema';
import macd from './macd';
import rsi from './rsi';
import sma from './sma';
import stochastic from './stochastic';

const layers: Record<LayerType, Layer> = {
  'price:candlesticks': candlesticks,
  'price:line': priceLine,
  atr,
  'bollinger-bands': bollingerBands,
  ema,
  macd,
  rsi,
  sma,
  stochastic,
  'volume:bars': volumeBars,
};

export default layers;
