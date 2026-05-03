/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import MONTHS from '../../../domain/constants/time/months';
import { TimeUnit } from '../../../domain/types/TimeUnit';
import utcToLocal from '../../../utils/time/utcToLocal';
import { TimeLabelFormatterArgs } from './TimeLabelFormatter';

type TimeFormatToken = 'HH:mm' | 'DD/MM' | 'MMM' | 'YYYY';

const FORMAT_BY_UNIT: Record<
  TimeUnit,
  { minor: TimeFormatToken; major?: TimeFormatToken }
> = {
  minute: { minor: 'HH:mm', major: 'DD/MM' },
  hour: { minor: 'HH:mm', major: 'DD/MM' },
  day: { minor: 'DD/MM', major: 'MMM' },
  week: { minor: 'DD/MM', major: 'MMM' },
  month: { minor: 'MMM', major: 'YYYY' },
  year: { minor: 'YYYY' },
};

const pad2 = (n: number) => String(n).padStart(2, '0');

function formatToken(
  token: TimeFormatToken,
  p: ReturnType<typeof utcToLocal>
): string {
  switch (token) {
    case 'HH:mm':
      return `${pad2(p.hour)}:${pad2(p.minute)}`;

    case 'DD/MM':
      return `${p.day}/${p.month + 1}`;

    case 'MMM':
      return MONTHS[p.month];

    case 'YYYY':
      return String(p.year);
  }
}

function utcToLocalSafe(
  utcTs: number,
  timeZoneId?: string,
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

export const defaultTimeLabelFormatter = ({
  utcTs,
  timeUnit,
  kind,
  timeZoneId,
}: TimeLabelFormatterArgs): string => {
  const formats = FORMAT_BY_UNIT[timeUnit];
  if (!formats) {
    throw new Error(`Unsupported timeUnit: ${timeUnit}`);
  }

  const token = formats[kind] ?? formats.minor;
  const local = utcToLocalSafe(utcTs, timeZoneId ?? undefined);

  return formatToken(token, local);
};

export default defaultTimeLabelFormatter;
