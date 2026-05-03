/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { Granularity } from '../Granularity';
import { TimeGridStep } from './TimeGridStep';

interface TimeIntervalSpec {
  key: Granularity;
  unit: 'minute' | 'hour' | 'day' | 'week' | 'month';
  value: number;
  gridLineSteps: TimeGridStep[];
}

export default TimeIntervalSpec;
