/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { DataMap } from './DataMap';
import { TimeScale } from './TimeScale';

export interface IndexProvider {
  marketHoursConfigComplete: unknown;
  sessionsAndBlocks: unknown;
  dataMap: DataMap;
  barsLength: number;
  firstDataPointIndex?: number;
  lastDataPointIndex?: number;
  indexToTimestamp: (timestamp: number) => number | undefined;
  findClosestIndex: (timestamp: number) => number;
  getTimescale: (intervalSize: number, scrollOffset: number, viewportWidth: number) => TimeScale;
}
