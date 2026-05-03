/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { DataMap } from '../../domain/types/DataMap';
import { LayersData } from '../../domain/types/LayersData';
import { CalculationContext } from './updateLayersData';

const createPriceVolumeDerivedLayerCalculationContext = (
  dataMap: DataMap,
  layersData: LayersData, // eslint-disable-line @typescript-eslint/no-unused-vars
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


      // not implemented in core
      // case 'derived':
      // case 'layer': {
     
    }
  }
});

export default createPriceVolumeDerivedLayerCalculationContext;
