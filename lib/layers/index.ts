/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerConfig } from '../config/layer/LayerConfig';
import LAYER_COMPONENT_TYPE_KEY from '../config/layer/layerComponentTypeKey';
import Candlesticks from './candlesticks/CandlesticksLayer';
import PriceLine from './priceLine/PriceLineLayer';
import VolumeBars from './volumeBars/VolumeBarsLayer';
import ATR from './atr/ATRLayer';
import BollingerBands from './bollingerBands/BollingerBandsLayer';
import EMA from './ema/EMALayer';
import MACD from './macd/MACDLayer';
import RSI from './rsi/RSILayer';
import SMA from './sma/SMALayer';
import Stochastic from './stochastic/StochasticLayer';

type LayerComponent = {
  [LAYER_COMPONENT_TYPE_KEY]?: LayerConfig['type'];
};

(Candlesticks as LayerComponent)[LAYER_COMPONENT_TYPE_KEY] = 'price:candlesticks';
(PriceLine as LayerComponent)[LAYER_COMPONENT_TYPE_KEY] = 'price:line';
(VolumeBars as LayerComponent)[LAYER_COMPONENT_TYPE_KEY] = 'volume:bars';
(ATR as LayerComponent)[LAYER_COMPONENT_TYPE_KEY] = 'atr';
(BollingerBands as LayerComponent)[LAYER_COMPONENT_TYPE_KEY] = 'bollinger-bands';
(EMA as LayerComponent)[LAYER_COMPONENT_TYPE_KEY] = 'ema';
(MACD as LayerComponent)[LAYER_COMPONENT_TYPE_KEY] = 'macd';
(RSI as LayerComponent)[LAYER_COMPONENT_TYPE_KEY] = 'rsi';
(SMA as LayerComponent)[LAYER_COMPONENT_TYPE_KEY] = 'sma';
(Stochastic as LayerComponent)[LAYER_COMPONENT_TYPE_KEY] = 'stochastic';

export {
  Candlesticks,
  PriceLine,
  VolumeBars,
  ATR,
  BollingerBands,
  EMA,
  MACD,
  RSI,
  SMA,
  Stochastic,
};
