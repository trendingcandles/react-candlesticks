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
  'ADXLayer': 'adx',
  'ATRLayer': 'atr',
  'BollingerBandsLayer': 'bollinger-bands',
  'CCILayer': 'cci',
  'EMALayer': 'ema',
  'MACDLayer': 'macd',
  'OBVLayer': 'obv',
  'ParabolicSARLayer': 'parabolic-sar',
  'RSILayer': 'rsi',
  'SMALayer': 'sma',
  'StochasticLayer': 'stochastic',
  'WilliamsRLayer': 'williams-r',
} as const satisfies Record<string, LayerConfig['type']>;

export default layerComponentNameToLayerTypeMap;
