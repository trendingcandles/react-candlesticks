/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { Temporal } from 'temporal-polyfill';
import { LocalDateTimeWithDow } from '../../domain/types/LocalDateTime';

export const utcToLocal = (utcMs: number, ianaTz: string): LocalDateTimeWithDow => {
  const instant = Temporal.Instant.fromEpochMilliseconds(utcMs);
  const wallClock = instant.toZonedDateTimeISO(ianaTz);
  return {
    year: wallClock.year,
    month: wallClock.month - 1,
    day: wallClock.day,
    hour: wallClock.hour,
    minute: wallClock.minute,
    dow: wallClock.dayOfWeek % 7, // convert MTWTFSS 1-based to SMTWTFS 0-based
    offset: wallClock.offsetNanoseconds / 3_600_000_000_000, // hours
  };
};

export default utcToLocal;
