/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { DataMap } from '../../domain/types/DataMap';
import getKnownBars from './getKnownBars';
import lowerBound from './lowerBound';

const timestampToBarIndex = (
  timestamp: number,
  dataMap: DataMap,
  nearest = true,
): number | undefined => {
  const { bars, ts } = getKnownBars(dataMap);
  if (ts.length === 0) return undefined;

  const p = lowerBound(ts, timestamp);
  if (!nearest) return bars[Math.max(0, Math.min(bars.length - 1, p))];
  if (p <= 0) return bars[0];
  if (p >= ts.length) return bars[bars.length - 1];

  return Math.abs(ts[p - 1] - timestamp) <= Math.abs(ts[p] - timestamp) ? bars[p - 1] : bars[p];
};

export default timestampToBarIndex;
