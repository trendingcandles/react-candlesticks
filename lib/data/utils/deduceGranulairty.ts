/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { DataPoint } from '../../domain/types/DataPoint';
import { Granularity } from '../../domain/types/Granularity';

const GRANULARITY_MINUTES: Record<Granularity, number> = {
  'm1':  1,
  'm2':  2,
  'm3':  3,
  'm5':  5,
  'm10': 10,
  'm15': 15,
  'm30': 30,
  'h1':  60,
  'h2':  120,
  'h4':  240,
  'd1':  1440,
  'w1':  10080,
  'M1':  43200, // ~30 days
};

const SAMPLE_CAP = 300; // max intervals to inspect

/**
 * Collects up to SAMPLE_CAP intervals using three probes:
 *   - start  (first third)
 *   - middle (centre third)
 *   - end    (last third)
 *
 * Sampling across the series catches granularity changes and avoids
 * a run of weekend/holiday gaps skewing a purely sequential scan.
 */
function sampleIntervals (data: DataPoint[]): number[] {
  const n = data.length;

  // Short enough — just iterate everything
  if (n - 1 <= SAMPLE_CAP) {
    return consecutiveIntervals(data, 0, n - 1);
  }

  const perProbe = Math.floor(SAMPLE_CAP / 3);

  const midStart = Math.floor((n - perProbe) / 2);

  const regions: [number, number][] = [
    [0,                      perProbe],           // start
    [midStart,               midStart + perProbe], // middle
    [n - 1 - perProbe,       n - 1],              // end
  ];

  const intervals: number[] = [];
  for (const [from, to] of regions) {
    intervals.push(...consecutiveIntervals(data, from, to));
  }
  return intervals;
}

/** Returns consecutive minute-diffs for data[from..to] (inclusive). */
function consecutiveIntervals(data: DataPoint[], from: number, to: number): number[] {
  const out: number[] = [];
  for (let i = from + 1; i <= to; i++) {
    const diff = (new Date(data[i].time).getTime() - new Date(data[i - 1].time).getTime()) / 60_000;
    if (diff > 0) out.push(diff);
  }
  return out;
}

function closestGranularity(minutes: number): Granularity {
  const candidates = Object.entries(GRANULARITY_MINUTES) as [Granularity, number][];
  candidates.sort(
    ([, a], [, b]) =>
      Math.abs(Math.log(a) - Math.log(minutes)) -
      Math.abs(Math.log(b) - Math.log(minutes))
  );
  return candidates[0][0];
};

const deduceGranularity = (data: DataPoint[]): Granularity => {
  if (data.length < 2) {
    throw new Error('Need at least 2 data points to deduce granularity');
  }

  const intervals = sampleIntervals(data);

  if (intervals.length === 0) {
    throw new Error('Could not compute any valid intervals');
  }

  const sorted = [...intervals].sort((a, b) => a - b);

  // Median of the bottom 10% (min 5 samples) ignores gap outliers
  const sampleSize = Math.max(5, Math.ceil(sorted.length * 0.1));
  const smallestSamples = sorted.slice(0, sampleSize);
  const median = smallestSamples[Math.floor(smallestSamples.length / 2)];

  return closestGranularity(median);
};

export default deduceGranularity;