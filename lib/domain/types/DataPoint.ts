/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

export interface DataPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
