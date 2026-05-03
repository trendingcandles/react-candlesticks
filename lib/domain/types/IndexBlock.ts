/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { RawSession } from './RawSession';

/**
 * one contiguous region of constant sized bars
 * this is your lookup table
 */
export type IndexBlock = {
  session: RawSession | null;
  sessions?: RawSession[];
  startIndex: number;
  startTs: number;
  endTs: number;
  barSizeMs: number;
  bars: number;
  calendar?: boolean;
  daily?: boolean;
  weekly?: boolean;
  monthly?: boolean;
  dayStartMs?: number;
  labelTs?: number;
};
