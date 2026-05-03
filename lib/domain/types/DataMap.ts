/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { DataPoint } from './DataPoint';
import { Granularity } from './Granularity';

export interface OHLCVData {
  timestamp: Float64Array;
  timeLabel: Float64Array;
  open: Float64Array;
  high: Float64Array;
  low: Float64Array;
  close: Float64Array;
  volume: Float64Array;
}

export interface DataMap {
  granularity: Granularity;
  rawData: DataPoint[];
  dataIndexByBar: Int32Array;
  ohlcvs: OHLCVData;
  lastBarWithDataIndex?: number;
}
