/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ValueGridLine } from './ValueGridLine';

const getStep = (valueRange: number, maxLines: number, steps: number[]): number => {
  const magnitude = Math.pow(10, Math.floor(Math.log10(valueRange)) - 1);

  for (const step of steps) {
    const scaledStep = step * magnitude;
    if (valueRange / scaledStep <= maxLines) {
      return scaledStep;
    }
  }

  return magnitude * 10; // Fallback if all steps exceed maxLines
};

const calculateValueGridLines = (
  minValue: number,
  maxValue: number,
  scaleY: (value: number) => number,
  maxGridLines: number,
  explicitLines?: number[],
): ValueGridLine[] => {

  if (explicitLines) {
    return explicitLines.map(value => ({ value, y: Math.floor(scaleY(value)) }));
  }

  const valueRange = maxValue - minValue || 1;
  const steps = [
    0.1, 0.2, 0.25, 0.5, 1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1_000,
    2_000, 5_000, 10_000, 20_000, 50_000, 100_000, 200_000, 500_000, 1_000_000, 2_000_000,
    5_000_000, 10_000_000, 20_000_000, 50_000_000, 100_000_000, 200_000_000, 500_000_000,
    1_000_000_000, 2_000_000_000, 5_000_000_000, 10_000_000_000, 20_000_000_000,
    50_000_000_000, 100_000_000_000, 200_000_000_000, 500_000_000_000, 1_000_000_000_000,
  ];

  const stepSize = getStep(valueRange, maxGridLines, steps);
  const firstGridLine = Math.ceil(minValue / stepSize) * stepSize;

  const minGridPrice = firstGridLine - stepSize * Math.ceil((firstGridLine - minValue) / stepSize);
  const maxGridPrice = firstGridLine + stepSize * Math.ceil((maxValue - firstGridLine) / stepSize);

  const lineValues: ValueGridLine[] = [];
  for (let price = minGridPrice; price <= maxGridPrice; price += stepSize) {
    const y = Math.floor(scaleY(price));
    lineValues.push({ value: price, y });
  }

  return lineValues;
};

export default calculateValueGridLines;
