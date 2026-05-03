/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { SmaLayerConfig, SmaLayerConfigComplete, SmaTheme } from '../../layers/sma/SmaLayerConfig';
import { StochasticLayerConfig, StochasticLayerConfigComplete, StochasticTheme } from '../../layers/stochastic/StochasticLayerConfig';
import { CandlestickLayerConfig, CandlestickLayerConfigComplete, CandlesticksTheme } from '../../layers/candlesticks/CandlestickLayerConfig';
import { PriceLineLayerConfig, PriceLineLayerConfigComplete, PriceLineTheme } from '../../layers/priceLine/PriceLineLayerConfig';
import { VolumeBarsLayerConfig, VolumeBarsLayerConfigComplete, VolumeBarsTheme } from '../../layers/volumeBars/VolumeBarsLayerConfig';
import { AtrLayerConfig, AtrLayerConfigComplete, AtrTheme } from '../../layers/atr/AtrLayerConfig';
import { BollingerBandsLayerConfig, BollingerBandsLayerConfigComplete, BollingerBandsTheme } from '../../layers/bollingerBands/BollingerBandsLayerConfig';
import { EmaLayerConfig, EmaLayerConfigComplete, EmaTheme } from '../../layers/ema/EmaLayerConfig';
import { MacdLayerConfig, MacdLayerConfigComplete, MacdTheme } from '../../layers/macd/MacdLayerConfig';
import { RsiLayerConfig, RsiLayerConfigComplete, RsiTheme } from '../../layers/rsi/RsiLayerConfig';

export type LayerConfigComplete =
  CandlestickLayerConfigComplete
  | PriceLineLayerConfigComplete
  | VolumeBarsLayerConfigComplete
  | AtrLayerConfigComplete
  | BollingerBandsLayerConfigComplete
  | EmaLayerConfigComplete
  | MacdLayerConfigComplete
  | RsiLayerConfigComplete
  | SmaLayerConfigComplete
  | StochasticLayerConfigComplete
  ;

export type LayerConfig =
  CandlestickLayerConfig
  | PriceLineLayerConfig
  | VolumeBarsLayerConfig
  | AtrLayerConfig
  | BollingerBandsLayerConfig
  | EmaLayerConfig
  | MacdLayerConfig
  | RsiLayerConfig
  | SmaLayerConfig
  | StochasticLayerConfig
  ;

export interface LayersTheme {
  candlesticks: CandlesticksTheme;
  priceLine: PriceLineTheme;
  volumeBars: VolumeBarsTheme;
  atr: AtrTheme;
  bollingerBands: BollingerBandsTheme;
  ema: EmaTheme;
  macd: MacdTheme;
  rsi: RsiTheme;
  sma: SmaTheme;
  stochastic: StochasticTheme;
}
  
