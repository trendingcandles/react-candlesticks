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
import { AdxLayerConfig, AdxLayerConfigComplete, AdxTheme } from '../../layers/adx/AdxLayerConfig';
import { CciLayerConfig, CciLayerConfigComplete, CciTheme } from '../../layers/cci/CciLayerConfig';
import { ObvLayerConfig, ObvLayerConfigComplete, ObvTheme } from '../../layers/obv/ObvLayerConfig';
import { ParabolicSarLayerConfig, ParabolicSarLayerConfigComplete, ParabolicSarTheme } from '../../layers/parabolicSar/ParabolicSarLayerConfig';
import { WilliamsRLayerConfig, WilliamsRLayerConfigComplete, WilliamsRTheme } from '../../layers/williamsR/WilliamsRLayerConfig';
import { BaseLayerConfig, BaseLayerConfigComplete } from './BaseLayerConfig';

export interface CustomLayerConfig extends BaseLayerConfig {
  type: string;
  [key: string]: unknown;
}

export interface CustomLayerConfigComplete extends BaseLayerConfigComplete {
  type: string;
  [key: string]: unknown;
}

export type LayerConfigComplete =
  CandlestickLayerConfigComplete
  | PriceLineLayerConfigComplete
  | VolumeBarsLayerConfigComplete
  | AdxLayerConfigComplete
  | AtrLayerConfigComplete
  | BollingerBandsLayerConfigComplete
  | CciLayerConfigComplete
  | EmaLayerConfigComplete
  | MacdLayerConfigComplete
  | ObvLayerConfigComplete
  | ParabolicSarLayerConfigComplete
  | RsiLayerConfigComplete
  | SmaLayerConfigComplete
  | StochasticLayerConfigComplete
  | WilliamsRLayerConfigComplete
  | CustomLayerConfigComplete
  ;

export type LayerConfig =
  CandlestickLayerConfig
  | PriceLineLayerConfig
  | VolumeBarsLayerConfig
  | AdxLayerConfig
  | AtrLayerConfig
  | BollingerBandsLayerConfig
  | CciLayerConfig
  | EmaLayerConfig
  | MacdLayerConfig
  | ObvLayerConfig
  | ParabolicSarLayerConfig
  | RsiLayerConfig
  | SmaLayerConfig
  | StochasticLayerConfig
  | WilliamsRLayerConfig
  | CustomLayerConfig
  ;

export interface LayersTheme {
  candlesticks: CandlesticksTheme;
  priceLine: PriceLineTheme;
  volumeBars: VolumeBarsTheme;
  adx: AdxTheme;
  atr: AtrTheme;
  bollingerBands: BollingerBandsTheme;
  cci: CciTheme;
  ema: EmaTheme;
  macd: MacdTheme;
  obv: ObvTheme;
  parabolicSar: ParabolicSarTheme;
  rsi: RsiTheme;
  sma: SmaTheme;
  stochastic: StochasticTheme;
  williamsR: WilliamsRTheme;
}
  
