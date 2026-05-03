/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

const parseLookback = (period: number, lookback?: number | ((period: number) => number)): number => {
  if (typeof lookback === 'number') {
    return lookback;
  }
  if (typeof lookback === 'function') {
    return lookback(period);
  }
  return period;
};

export default parseLookback;
