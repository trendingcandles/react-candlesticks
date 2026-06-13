/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

const defaultValueLabelFormatter = (value: number): string => {
  if (!Number.isFinite(value)) return String(value);

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue === 0) return '0.00';

  const stripTrailingZeros = (valueText: string): string =>
    valueText.replace(/\.?0+$/, '');

  const formatWithDigits = (num: number, maxDigits: number): string => {
    const digitsBeforeDecimal = Math.floor(Math.log10(num)) + 1;
    const decimalPlaces = Math.max(0, maxDigits - digitsBeforeDecimal);
    return stripTrailingZeros(num.toFixed(decimalPlaces));
  };

  const withCommas = (num: number): string =>
    num.toLocaleString(undefined, { maximumFractionDigits: 0 });

  if (absValue < 0.0001) {
    const exponential = absValue.toExponential(2).replace(/\.?0+e/, 'e');
    return `${sign}${exponential}`;
  }

  if (absValue < 1) {
    return `${sign}${stripTrailingZeros(absValue.toFixed(4))}`;
  }

  if (absValue < 10_000) {
    return `${sign}${absValue.toFixed(2)}`;
  }

  if (absValue < 1_000_000) {
    return `${sign}${withCommas(absValue)}`;
  }

  const suffixes = [
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
  ];

  let suffixIndex = suffixes.findLastIndex(({ value: divisor }) => absValue >= divisor);
  let { value: divisor, symbol } = suffixes[suffixIndex];
  let formatted = formatWithDigits(absValue / divisor, 4);

  if (formatted === '1000' && suffixIndex < suffixes.length - 1) {
    suffixIndex++;
    ({ value: divisor, symbol } = suffixes[suffixIndex]);
    formatted = formatWithDigits(absValue / divisor, 4);
  }

  return `${sign}${formatted}${symbol}`;
};

export default defaultValueLabelFormatter;
