/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { DataMap } from '../../domain/types/DataMap';
import { Granularity } from '../../domain/types/Granularity';
import { TimeScale } from '../../domain/types/TimeScale';
import lowerBound from '../../indexProviders/continuous/lowerBound';
import createTimeScale from '../core/createTimeScale';

const continuousTimeScale = (
  dataMap: DataMap,
  granularity: Granularity,
  intervalSize: number,
  scrollOffset: number,
  viewportWidth: number,
): TimeScale => {
  const timeZoneId = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  return createTimeScale({
    dataMap,
    granularity,
    intervalSize,
    scrollOffset,
    viewportWidth,
    timeZoneId,
    timestampToIndex: (timestamp: number, nearest?: boolean): number | undefined => {
      const ts = dataMap.ohlcvs.timestamp;
      if (ts.length === 0) return undefined;

      const pos = lowerBound(ts, timestamp);

      if (nearest) {
        if (pos <= 0) return 0;
        if (pos >= ts.length) return ts.length - 1;
        return Math.abs(ts[pos - 1] - timestamp) <= Math.abs(ts[pos] - timestamp) ? pos - 1 : pos;
      }

      if (pos <= 0) return 0;
      if (pos >= ts.length) return ts.length - 1;
      return pos;
    },
  });
};

export default continuousTimeScale;
