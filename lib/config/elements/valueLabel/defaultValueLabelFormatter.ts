/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

const defaultValueLabelFormatter = (value: number): string => {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue === 0) return '0.00';

  const formatWithDigits = (num: number, maxDigits: number): string => {
    const digitsBeforeDecimal = Math.floor(Math.log10(num)) + 1;
    const decimalPlaces = Math.max(0, maxDigits - digitsBeforeDecimal);
    return num.toFixed(decimalPlaces);
  };

  const withCommas = (num: number): string =>
    num.toLocaleString(undefined, { maximumFractionDigits: 0 });

  if (absValue < 1) {
    // Show up to 4 decimals, strip trailing zeros
    return `${sign}${absValue.toFixed(4).replace(/\.?0+$/, '')}`;
  }

  if (absValue < 10_000) {
    // Always 2 decimal places
    return `${sign}${absValue.toFixed(2)}`;
  }

  if (absValue < 1_000_000) {
    // Comma-separated whole number
    return `${sign}${withCommas(absValue)}`;
  }

  // ≥ 1,000,000: use suffixes
  const suffixes = [
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
  ];

  for (const { value: divisor, symbol } of suffixes) {
    if (absValue >= divisor) {
      const scaled = absValue / divisor;
      return `${sign}${formatWithDigits(scaled, 4)}${symbol}`;
    }
  }

  // fallback (shouldn't happen)
  return `${sign}${absValue.toFixed(2)}`;
};

export default defaultValueLabelFormatter;
