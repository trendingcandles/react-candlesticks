/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { DAY_MS, HOUR_MS, MINUTE_MS, WEEK_MS } from '../../domain/constants/time/timeDurationsAsMs';
import { LocalDateTime } from '../../domain/types/LocalDateTime';
import { TimeGridStep } from '../../domain/types/gridLine/TimeGridStep';

const EPOCH_MS = Date.UTC(1970, 0, 4); // Sunday Jan 4, 1970

// ------------------------------------------------------------
// Precomputed helpers
// ------------------------------------------------------------

function toLocalEpochMs(dt: LocalDateTime) {
  // Treat local fields as absolute for gridline math (no offset)
  return Date.UTC(dt.year, dt.month - 1, dt.day, dt.hour, dt.minute);
}

function getMinute(dt: LocalDateTime) {
  return (toLocalEpochMs(dt) / MINUTE_MS) | 0;
}

function getHour(dt: LocalDateTime) {
  return (toLocalEpochMs(dt) / HOUR_MS) | 0;
}

function getDay(dt: LocalDateTime) {
  return (toLocalEpochMs(dt) / DAY_MS) | 0;
}

function getWeek(dt: LocalDateTime) {
  return ((toLocalEpochMs(dt) - EPOCH_MS) / WEEK_MS) | 0;
}

function getMonth(dt: LocalDateTime) {
  return (dt.year * 12) + (dt.month - 1);
}

function getYear(dt: LocalDateTime) {
  return dt.year;
}

// ------------------------------------------------------------
// Unit dispatch table (faster than switch in hot path)
// ------------------------------------------------------------

export const UNIT_FN: Record<TimeGridStep['unit'], (dt: LocalDateTime) => number> = {
  minute: getMinute,
  hour:   getHour,
  day:    getDay,
  week:   getWeek,
  month:  getMonth,
  year:   getYear
};

// ------------------------------------------------------------
// Major unit mapping
// ------------------------------------------------------------

const MAJOR_UNIT: Partial<Record<TimeGridStep['unit'], TimeGridStep['unit']>> = {
  minute: 'day',
  hour:   'day',
  day:    'month',
  week:   'month',
  month:  'year'
};

// ------------------------------------------------------------
// Optimized gridline test
// ------------------------------------------------------------

function isTimeGridLine(
  step: TimeGridStep,
  localDateTime: LocalDateTime,
  prevLocalDateTime?: LocalDateTime,
  prevUnitValue?: number
): { major?: boolean } | false {

  if (!prevLocalDateTime || prevUnitValue == null) return false;

  const unitFn = UNIT_FN[step.unit];
  const currentUnitValue = unitFn(localDateTime);

  // Fast boundary check
  if (
    ((currentUnitValue / step.number) | 0) ===
    ((prevUnitValue    / step.number) | 0)
  ) {
    return false;
  }

  // -------- Major line check --------

  let major = false;
  const majorUnit = MAJOR_UNIT[step.unit];

  if (majorUnit) {
    const majorFn = UNIT_FN[majorUnit];
    const currMajor = majorFn(localDateTime);
    const prevMajor = majorFn(prevLocalDateTime);

    major = currMajor !== prevMajor;
  }

  return { major };
}

export default isTimeGridLine;
