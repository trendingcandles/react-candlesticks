/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { TimeUnit } from '../../../domain/types/TimeUnit';

export type TimeLabelKind = 'minor' | 'major';

export interface TimeLabelFormatterArgs {
  utcTs: number;
  timeUnit: TimeUnit;
  kind: TimeLabelKind;
  timeZoneId?: string | null;
}

export type TimeLabelFormatter = (args: TimeLabelFormatterArgs) => string;
