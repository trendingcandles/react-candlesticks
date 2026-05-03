/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { TimeUnit } from '../../../../domain/types/TimeUnit';

export interface TimeGridLine {
  unit: TimeUnit;
  number: number;
  multiple: number;
  parity?: boolean;
  modulus?: number;
  even?: boolean;
  isSecondaryLabel?: boolean;
  parityGridLine?: TimeGridLine;
}
