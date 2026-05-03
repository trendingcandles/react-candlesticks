/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

export const assertFiniteNumber = (value: number, label: string): number => {
  if (!Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number`);
  }
  return value;
};

export const assertNonNegativeNumber = (value: number, label: string): number => {
  if (assertFiniteNumber(value, label) < 0) {
    throw new Error(`${label} must be >= 0`);
  }
  return value;
};

export const assertPositiveNumber = (value: number, label: string): number => {
  if (assertFiniteNumber(value, label) <= 0) {
    throw new Error(`${label} must be > 0`);
  }
  return value;
};
