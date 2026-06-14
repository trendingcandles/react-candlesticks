/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import LAYER_COMPONENT_TYPE_KEY from '../config/layer/layerComponentTypeKey';
import Candlesticks from './candlesticks/CandlesticksLayer';
import PriceLine from './priceLine/PriceLineLayer';
import VolumeBars from './volumeBars/VolumeBarsLayer';
import ADX from './adx/ADXLayer';
import ATR from './atr/ATRLayer';
import BollingerBands from './bollingerBands/BollingerBandsLayer';
import EMA from './ema/EMALayer';
import MACD from './macd/MACDLayer';
import RSI from './rsi/RSILayer';
import SMA from './sma/SMALayer';
import Stochastic from './stochastic/StochasticLayer';
import CCI from './cci/CCILayer';
import OBV from './obv/OBVLayer';
import ParabolicSAR from './parabolicSar/ParabolicSARLayer';
import WilliamsR from './williamsR/WilliamsRLayer';
export { default as defineLayer } from './defineLayer';
export type {
  CustomLayerComponent,
  CustomLayerDefinition,
  CustomLayerOptions,
} from './defineLayer';
export type {
  CustomLayerConfig,
  CustomLayerConfigComplete,
} from '../config/layer/LayerConfig';
export type {
  LayerCalculate,
  LayerDraw,
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

type LayerComponent = {
  [LAYER_COMPONENT_TYPE_KEY]?: string;
};

(Candlesticks as LayerComponent)[LAYER_COMPONENT_TYPE_KEY] = 'price:candlesticks';
(PriceLine as LayerComponent)[LAYER_COMPONENT_TYPE_KEY] = 'price:line';
(VolumeBars as LayerComponent)[LAYER_COMPONENT_TYPE_KEY] = 'volume:bars';
(ADX as LayerComponent)[LAYER_COMPONENT_TYPE_KEY] = 'adx';
(ATR as LayerComponent)[LAYER_COMPONENT_TYPE_KEY] = 'atr';
(BollingerBands as LayerComponent)[LAYER_COMPONENT_TYPE_KEY] = 'bollinger-bands';
(EMA as LayerComponent)[LAYER_COMPONENT_TYPE_KEY] = 'ema';
(MACD as LayerComponent)[LAYER_COMPONENT_TYPE_KEY] = 'macd';
(RSI as LayerComponent)[LAYER_COMPONENT_TYPE_KEY] = 'rsi';
(SMA as LayerComponent)[LAYER_COMPONENT_TYPE_KEY] = 'sma';
(Stochastic as LayerComponent)[LAYER_COMPONENT_TYPE_KEY] = 'stochastic';
(CCI as LayerComponent)[LAYER_COMPONENT_TYPE_KEY] = 'cci';
(OBV as LayerComponent)[LAYER_COMPONENT_TYPE_KEY] = 'obv';
(ParabolicSAR as LayerComponent)[LAYER_COMPONENT_TYPE_KEY] = 'parabolic-sar';
(WilliamsR as LayerComponent)[LAYER_COMPONENT_TYPE_KEY] = 'williams-r';

export {
  Candlesticks,
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
