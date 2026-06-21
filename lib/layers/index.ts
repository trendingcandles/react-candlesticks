/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import adx from './adx';
import area from './area';
import atr from './atr';
import bollingerBands from './bollingerBands';
import candlesticks from './candlesticks';
import cci from './cci';
import ema from './ema';
import macd from './macd';
import obv from './obv';
import ohlcBars from './ohlcBars';
import parabolicSar from './parabolicSar';
import priceLine from './priceLine';
import rsi from './rsi';
import sma from './sma';
import stochastic from './stochastic';
import volumeBars from './volumeBars';
import williamsR from './williamsR';
export { default as defineLayer } from './defineLayer';
export type {
  CustomLayerComponent,
  CustomLayerDefinition,
  CustomLayerOptions,
  DefineLayerOptions,
  LayerComponent,
  LayerDefinition,
  LayerDefinitionConfig,
  LayerDefinitionConfigComplete,
} from './defineLayer';
export type {
  BuiltInLayerConfig,
  BuiltInLayerConfigComplete,
  CustomLayerConfig,
  CustomLayerConfigComplete,
  LayerConfig,
  LayerConfigComplete,
} from '../config/layer/LayerConfig';
export type {
  BuiltInLayerDefinition,
  BuiltInLayerType,
} from './builtInLayers';
export type {
  LayerCalculate,
  LayerDraw,
  LayerClickHandler,
  LayerHit,
  LayerHitTest,
  LayerHitTestContext,
  LayerHitTestResult,
  LayerHoverHandler,
  LayerPointer,
} from '../config/layer/Layer';
export type {
  BaseLayerConfig,
  BaseLayerConfigComplete,
  InputSource,
  LayerScale,
  ScaleDomain,
  ScalePolicy,
  ScaleRange,
  ValueToYFunction,
} from '../config/layer/BaseLayerConfig';
export type {
  AreaFillConfig,
  AreaFillConfigComplete,
  AreaLayerConfig,
  AreaLayerConfigComplete,
} from './area/AreaLayerConfig';
export type {
  OhlcBarsLayerConfig,
  OhlcBarsLayerConfigComplete,
} from './ohlcBars/OhlcBarsLayerConfig';
export { default as drawLineIndicator } from '../drawing/layer/drawLineIndicator';
export type { LineIndicatorSeries } from '../drawing/layer/drawLineIndicator';
export { default as drawLineSeries } from '../drawing/series/drawLineSeries';
export type {
  DrawLineSeriesOptions,
  DrawLineSeriesResult,
} from '../drawing/series/drawLineSeries';
export { default as parseLineConfig } from '../config/elements/line/parseLineConfig';
export type {
  LineConfig,
  LineConfigComplete,
  LineTheme,
} from '../config/elements/line/LineConfig';
export { default as parseLegendConfig } from '../config/legend/parseLegendConfig';
export { default as parseYAxisConfig } from '../config/layer/yAxis/parseYAxisConfig';

const Candlesticks = candlesticks.Component;
const OhlcBars = ohlcBars.Component;
const PriceLine = priceLine.Component;
const Area = area.Component;
const VolumeBars = volumeBars.Component;
const ADX = adx.Component;
const ATR = atr.Component;
const BollingerBands = bollingerBands.Component;
const CCI = cci.Component;
const EMA = ema.Component;
const MACD = macd.Component;
const OBV = obv.Component;
const ParabolicSAR = parabolicSar.Component;
const RSI = rsi.Component;
const SMA = sma.Component;
const Stochastic = stochastic.Component;
const WilliamsR = williamsR.Component;

export {
  Area,
  Candlesticks,
  OhlcBars,
  PriceLine,
  VolumeBars,
  ADX,
  ATR,
  BollingerBands,
  EMA,
  MACD,
  RSI,
  SMA,
  Stochastic,
  CCI,
  OBV,
  ParabolicSAR,
  WilliamsR,
};
