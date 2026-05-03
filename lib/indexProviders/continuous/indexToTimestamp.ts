/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { DataMap } from '../../domain/types/DataMap';

const indexToTimestamp = (
  index: number,
  dataMap: DataMap,
): number | undefined => {
  const i = Math.round(index);
  if (i < 0 || i >= dataMap.ohlcvs.timestamp.length) return undefined;
  const ts = dataMap.ohlcvs.timestamp[i];
  return Number.isFinite(ts) ? ts : undefined;
};

export default indexToTimestamp;
