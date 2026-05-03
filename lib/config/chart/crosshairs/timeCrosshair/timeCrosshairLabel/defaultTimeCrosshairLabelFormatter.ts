/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { TimeUnit } from '../../../../../domain/types/TimeUnit';
import { TimeCrosshairLabelFormatterArgs } from './TimeCrosshairLabelFormatter';
import DAYS from '../../../../../domain/constants/time/days';
import MONTHS from '../../../../../domain/constants/time/months';
import { DateTimeFormatToken } from '../../../../../domain/types/DateTimeFormatToken';
import utcToLocal from '../../../../../utils/time/utcToLocal';


const FORMAT_BY_UNIT: Record<TimeUnit, DateTimeFormatToken> = {
  minute: 'ddd DD MMM YY HH:mm',
  hour: 'ddd DD MMM YY HH:mm',
  day: 'ddd DD MMM YY',
  week: 'ddd DD MMM YY',
  month: 'ddd DD MMM YY',
  year: 'ddd DD MMM YY',
};

const pad2 = (n: number) => String(n).padStart(2, '0');

function formatToken(
  token: DateTimeFormatToken,
  p: ReturnType<typeof utcToLocal>
): string {

  const dayName = DAYS[p.dow];
  const monthName = MONTHS[p.month];

  switch (token) {
    case 'ddd DD MMM YY HH:mm':
      return`${dayName} ${p.day} ${monthName} '${p.year} ${pad2(p.hour)}:${pad2(p.minute)}`;

    case 'ddd DD MMM YY':
      return`${dayName} ${p.day} ${monthName} '${p.year}`;
  }
}

function utcToLocalSafe(
  utcTs: number,
  timeZoneId?: string
) {
  if (!timeZoneId) {
    const d = new Date(utcTs);
    return {
      year: d.getUTCFullYear(),
      month: d.getUTCMonth(),
      day: d.getUTCDate(),
      hour: d.getUTCHours(),
      minute: d.getUTCMinutes(),
      dow: d.getUTCDay(),
      offset: 0,
    };
  }

  return utcToLocal(utcTs, timeZoneId);
}

export const defaultTimeCrosshairLabelFormatter = ({
  utcTs,
  timeUnit,
  timeZoneId,
}: TimeCrosshairLabelFormatterArgs): string => {
  const format = FORMAT_BY_UNIT[timeUnit];
  if (!format) {
    throw new Error(`Unsupported timeUnit: ${timeUnit}`);
  }

  const local = utcToLocalSafe(utcTs, timeZoneId ?? undefined);

  return formatToken(format, local);
};

export default defaultTimeCrosshairLabelFormatter;




















/*
const getTimeCrosshairLabelFormat = (timeUnit: TimeUnit): CrosshairTimeFormat => {
  return {
    minute: 'ddd DD MMM YY HH:mm',
    hour: 'ddd DD MMM YY HH:mm',
    day: 'ddd DD MMM YY',
    week: 'ddd DD MMM YY',
    month: 'ddd DD MMM YY',
    year: 'ddd DD MMM YY'
  }[timeUnit] as CrosshairTimeFormat;
};

const defaultTimeCrosshairLabelFormatter: TimeCrosshairLabelFormatter = (timeUnit: TimeUnit, timestampMs: number): string => {
  const format = getTimeCrosshairLabelFormat(timeUnit);

  const date = new Date(timestampMs);

  const dayName = DAYS[date.getUTCDay()];
  const monthName = MONTHS[date.getUTCMonth()];
  const dayDate = date.getUTCDate();
  const year = date.getUTCFullYear().toString().slice(-2);
  
  if (format === 'ddd DD MMM YY') {
    return `${dayName} ${dayDate} ${monthName} '${year}`;
  } else if (format === 'ddd DD MMM YY HH:mm') {
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${dayName} ${dayDate} ${monthName} '${year}  ${hours}:${minutes}`;
  }

  throw new Error('Invalid time format');
}

export default defaultTimeCrosshairLabelFormatter;
*/
