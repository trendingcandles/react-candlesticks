/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { Temporal } from 'temporal-polyfill';

export const localToUtc = (
  local: {
    year: number;
    month: number; // 0-based
    day: number;
    hour: number;
    minute: number;
  },
  ianaTz: string
): number => {

  // todo: expensive
  const zoned = Temporal.ZonedDateTime.from({
    timeZone: ianaTz,
    year: local.year,
    month: local.month + 1, // Temporal is 1-based
    day: local.day,
    hour: local.hour,
    minute: local.minute,
  });

  const utcMs = zoned.toInstant().epochMilliseconds;

  return utcMs;
};

export default localToUtc;
