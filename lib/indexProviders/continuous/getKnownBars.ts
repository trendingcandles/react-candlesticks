/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { DataMap } from '../../domain/types/DataMap';

const getKnownBars = (dataMap: DataMap) => {
  const bars: number[] = [];
  const ts: number[] = [];
  for (let i = 0; i < dataMap.ohlcvs.timestamp.length; i += 1) {
    const t = dataMap.ohlcvs.timestamp[i];
    if (Number.isFinite(t)) { bars.push(i); ts.push(t); }
  }
  return { bars, ts };
};

export default getKnownBars;
