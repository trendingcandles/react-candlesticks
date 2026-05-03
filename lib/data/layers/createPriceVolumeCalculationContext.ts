/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { DataMap } from '../../domain/types/DataMap';
import { CalculationContext } from './updateLayersData';

const createPriceVolumeCalculationContext = (
  dataMap: DataMap,
): CalculationContext => ({
  resolve(input) {
    const src = input.source;

    switch (src.type) {
      case 'price':
        return {
          id: src.field,
          values: dataMap.ohlcvs[src.field]
        };

      case 'volume':
        return {
          id: src.field,
          values: dataMap.ohlcvs[src.field]
        };

      default:
        return null;
    }
  }
});

export default createPriceVolumeCalculationContext;
