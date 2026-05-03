/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { Granularity } from '../Granularity';
import { TimeUnit } from '../TimeUnit';

export interface TimeGridStep {
  granularity: Granularity;
  unit: TimeUnit; // 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
  number: number;
  multiple: number;
  parity?: boolean;
  even?: boolean;
  showLabel?: boolean;
  major?: boolean;
  isSecondaryLabel?: boolean;
  parityGridLine?: TimeGridStep;
}
