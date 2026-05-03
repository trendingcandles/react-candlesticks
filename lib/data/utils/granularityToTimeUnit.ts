/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { Granularity } from '../../domain/types/Granularity';
import { TimeUnit } from '../../domain/types/TimeUnit';

const granularityToTimeUnit = (granularity: Granularity): TimeUnit => {
  return {
    m1:  'minute' as TimeUnit,
    m2:  'minute' as TimeUnit,
    m3:  'minute' as TimeUnit,
    m5: 'minute' as TimeUnit,
    m10: 'minute' as TimeUnit,
    m15: 'minute' as TimeUnit,
    m30: 'minute' as TimeUnit,
    h1: 'hour' as TimeUnit,
    h2: 'hour' as TimeUnit,
    h4: 'hour' as TimeUnit,
    d1: 'day' as TimeUnit,
    w1: 'week' as TimeUnit,
    M1: 'month' as TimeUnit,
  }[granularity];
};

export default granularityToTimeUnit;
