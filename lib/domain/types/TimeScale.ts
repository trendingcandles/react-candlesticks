/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { Granularity } from './Granularity';
import { TimeGridLine } from './gridLine/TimeGridLine';

export interface TimeScale {
  metadata: {
    granularity: Granularity;
    intervalSize: number;
    halfInterval: number;
    viewportWidth: number;
    scrollOffset: number;
  };

  sessionsAndBlocks: unknown;

  startIntervalIndex: number;
  endIntervalIndex: number;
  startBarIndex: number;
  endBarIndex: number;
  gridLines: TimeGridLine[];

  xToBarIndex: (x: number, round?: boolean) => number;
  xToIntervalX: (x: number, scrollOffset: number) => number;
  timestampToIndex: (timestamp: number, nearest?: boolean) => number | undefined;
  getLastVisibleBarIndex: (lastValidBarIndex: number) => number;
}
