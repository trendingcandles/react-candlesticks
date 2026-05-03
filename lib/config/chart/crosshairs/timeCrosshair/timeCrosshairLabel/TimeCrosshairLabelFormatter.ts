/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { TimeUnit } from '../../../../../domain/types/TimeUnit';

export interface TimeCrosshairLabelFormatterArgs {
  utcTs: number;
  timeUnit: TimeUnit;
  timeZoneId?: string | null;
}

export type TimeCrosshairLabelFormatter = (args: TimeCrosshairLabelFormatterArgs) => string;