/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerConfig } from './LayerConfig';

const layerComponentNameToLayerTypeMap = {
  'CandlesticksLayer': 'price:candlesticks',
  'PriceLineLayer': 'price:line',
  'VolumeBarsLayer': 'volume:bars',
  'ATRLayer': 'atr',
  'BollingerBandsLayer': 'bollinger-bands',
  'EMALayer': 'ema',
  'MACDLayer': 'macd',
  'RSILayer': 'rsi',
  'SMALayer': 'sma',
  'StochasticLayer': 'stochastic',
} as const satisfies Record<string, LayerConfig['type']>;

export default layerComponentNameToLayerTypeMap;
