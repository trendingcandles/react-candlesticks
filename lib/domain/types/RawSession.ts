/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

/** one trading session in pure wall-clock */
export type RawSession = {
  open: number;          // unix ms, local tz applied already
  close: number;         // unix ms
  dayStartUtc: number;
  weekStartUtc: number;
  monthStartUtc: number;
  // quarterStartUtc: number;
  // yearStartUtc: number;
};
