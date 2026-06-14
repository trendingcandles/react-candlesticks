/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import adx from './adx';
import atr from './atr';
import bollingerBands from './bollingerBands';
import candlesticks from './candlesticks';
import cci from './cci';
import ema from './ema';
import macd from './macd';
import obv from './obv';
import parabolicSar from './parabolicSar';
import priceLine from './priceLine';
import rsi from './rsi';
import sma from './sma';
import stochastic from './stochastic';
import volumeBars from './volumeBars';
import williamsR from './williamsR';

const builtInLayerDefinitions = [
  candlesticks,
  priceLine,
  volumeBars,
  adx,
  atr,
  bollingerBands,
  cci,
  ema,
  macd,
  obv,
  parabolicSar,
  rsi,
  sma,
  stochastic,
  williamsR,
] as const;

export type BuiltInLayerDefinition = typeof builtInLayerDefinitions[number];
export type BuiltInLayerType = BuiltInLayerDefinition['type'];

export default builtInLayerDefinitions;
