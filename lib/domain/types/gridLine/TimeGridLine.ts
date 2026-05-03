/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { TimeGridStep } from './TimeGridStep';

export interface TimeGridLine {
  step: TimeGridStep;
  barIndex: number;
  timestamp: number;
  major?: boolean;
}
