/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { AdxTheme } from '../../layers/adx/AdxLayerConfig';
import { AtrTheme } from '../../layers/atr/AtrLayerConfig';
import { BollingerBandsTheme } from '../../layers/bollingerBands/BollingerBandsLayerConfig';
import { CandlesticksTheme } from '../../layers/candlesticks/CandlestickLayerConfig';
import { CciTheme } from '../../layers/cci/CciLayerConfig';
import { EmaTheme } from '../../layers/ema/EmaLayerConfig';
import { MacdTheme } from '../../layers/macd/MacdLayerConfig';
import { ObvTheme } from '../../layers/obv/ObvLayerConfig';
import { ParabolicSarTheme } from '../../layers/parabolicSar/ParabolicSarLayerConfig';
import { PriceLineTheme } from '../../layers/priceLine/PriceLineLayerConfig';
import { RsiTheme } from '../../layers/rsi/RsiLayerConfig';
import { SmaTheme } from '../../layers/sma/SmaLayerConfig';
import { StochasticTheme } from '../../layers/stochastic/StochasticLayerConfig';
import { VolumeBarsTheme } from '../../layers/volumeBars/VolumeBarsLayerConfig';
import { WilliamsRTheme } from '../../layers/williamsR/WilliamsRLayerConfig';

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
