/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerDataInstance } from './LayersData';
import { OHLCVData } from './DataMap';

export interface DataPointInfo {
  x: number;
  barIndex: number;
  ohlcvs: OHLCVData;
  layerDataInstances: Record<string, LayerDataInstance>;
}

export default DataPointInfo;
