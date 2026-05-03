/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { DataMap } from '../../domain/types/DataMap';
import lowerBound from './lowerBound';

const findClosestIndex = (timestamp: number, dataMap: DataMap): number => {
  const ts = dataMap.ohlcvs.timestamp;
  if (ts.length === 0) return 0;

  const pos = lowerBound(ts, timestamp);
  if (pos <= 0) return 0;
  if (pos >= ts.length) return ts.length - 1;

  return Math.abs(ts[pos - 1] - timestamp) <= Math.abs(ts[pos] - timestamp)
    ? pos - 1
    : pos;
};

export default findClosestIndex;
