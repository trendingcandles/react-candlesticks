/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { Granularity } from '../../domain/types/Granularity';
import { TimeGridStep } from '../../domain/types/gridLine/TimeGridStep';
import TimeIntervalSpec from '../../domain/types/gridLine/TimeIntervalSpec';

export const MIN_TIME_LINE_SPACING = 80;

const gridLineSteps1m: TimeGridStep[] = [
  { granularity: 'm1', unit: 'minute', number: 1, multiple: 1, parity: true}, // for m1 chart granularity, time grid lines are every m1 candle for the most zoomed in charts
  { granularity: 'm1', unit: 'minute', number: 5, multiple: 5},
  { granularity: 'm1', unit: 'minute', number: 15, multiple: 15},
  { granularity: 'm1', unit: 'minute', number: 30, multiple: 30}, // for m1 chart granularity, time grid lines are every 30 minutes for the most zoomed out charts
];

const gridLineSteps2m: TimeGridStep[] = [
  { granularity: 'm2', unit: 'minute', number: 2, multiple: 1, parity: true}, // for m2 chart granularity, time grid lines are every m2 candle for the most zoomed in charts
  { granularity: 'm2', unit: 'minute', number: 10, multiple: 5},
  { granularity: 'm2', unit: 'minute', number: 30, multiple: 15},
  { granularity: 'm2', unit: 'hour', number: 1, multiple: 30}, // for m2 chart granularity, time grid lines are every hour for the most zoomed out charts
];

const gridLineSteps3m: TimeGridStep[] = [
  { granularity: 'm3', unit: 'minute', number: 3, multiple: 1, parity: true},
  { granularity: 'm3', unit: 'minute', number: 15, multiple: 5},
  { granularity: 'm3', unit: 'minute', number: 30, multiple: 10},
  { granularity: 'm3', unit: 'hour', number: 1, multiple: 20},
  { granularity: 'm3', unit: 'hour', number: 2, multiple: 40},
];

const gridLineSteps5m: TimeGridStep[] = [
  { granularity: 'm5', unit: 'minute', number: 5, multiple: 1, parity: true},
  { granularity: 'm5', unit: 'minute', number: 15, multiple: 3},
  { granularity: 'm5', unit: 'minute', number: 30, multiple: 6},
  { granularity: 'm5', unit: 'hour', number: 1, multiple: 12},
  { granularity: 'm5', unit: 'hour', number: 2, multiple: 24},
  { granularity: 'm5', unit: 'hour', number: 6, multiple: 144},
  { granularity: 'm5', unit: 'hour', number: 12, multiple: 288},
];

const gridLineSteps10m: TimeGridStep[] = [
  { granularity: 'm10', unit: 'minute', number: 10, multiple: 1, parity: true}, // for m10...
  { granularity: 'm10', unit: 'minute', number: 30, multiple: 3},
  { granularity: 'm10', unit: 'hour', number: 1, multiple: 6},
  { granularity: 'm10', unit: 'hour', number: 2, multiple: 12},
  { granularity: 'm10', unit: 'hour', number: 6, multiple: 72},
  { granularity: 'm10', unit: 'hour', number: 12, multiple: 144},
];

const gridLineSteps15m: TimeGridStep[] = [
  { granularity: 'm15', unit: 'minute', number: 15, multiple: 1, parity: true},
  { granularity: 'm15', unit: 'minute', number: 30, multiple: 2},
  { granularity: 'm15', unit: 'hour', number: 1, multiple: 4},
  { granularity: 'm15', unit: 'hour', number: 2, multiple: 8},
  { granularity: 'm15', unit: 'hour', number: 6, multiple: 24},
  { granularity: 'm15', unit: 'hour', number: 12, multiple: 48},
  { granularity: 'm15', unit: 'day', number: 1, multiple: 96},
];

const gridLineSteps30m: TimeGridStep[] = [
  { granularity: 'm30', unit: 'minute', number: 30, multiple: 1, parity: true},
  { granularity: 'm30', unit: 'hour', number: 1, multiple: 2},
  { granularity: 'm30', unit: 'hour', number: 2, multiple: 4},
  { granularity: 'm30', unit: 'hour', number: 6, multiple: 12},
  { granularity: 'm30', unit: 'hour', number: 12, multiple: 24},
  { granularity: 'm30', unit: 'day', number: 1, multiple: 48},
  { granularity: 'm30', unit: 'week', number: 1, multiple: 5 * 48}, // multiple is approximate
];

const gridLineSteps1h: TimeGridStep[] = [
  { granularity: 'h1', unit: 'hour', number: 1, multiple: 1, parity: true},
  { granularity: 'h1', unit: 'hour', number: 4, multiple: 4},
  { granularity: 'h1', unit: 'hour', number: 6, multiple: 6},
  { granularity: 'h1', unit: 'hour', number: 8, multiple: 8},
  { granularity: 'h1', unit: 'hour', number: 12, multiple: 12},
  { granularity: 'h1', unit: 'day', number: 1, multiple: 24}, // depends if stock or 24-hour market
  { granularity: 'h1', unit: 'week', number: 1, multiple: 50}, // multiple is approximate; depends if stock or 24-hour market
  { granularity: 'h1', unit: 'month', number: 1, multiple: 200}, // multiple is approximate; depends if stock or 24-hour market
];

const gridLineSteps2h: TimeGridStep[] = [
  { granularity: 'h2', unit: 'hour', number: 2, multiple: 1, parity: true },
  { granularity: 'h2', unit: 'hour', number: 12, multiple: 6},
  { granularity: 'h2', unit: 'day', number: 1, multiple: 12}, // depends if stock or 24-hour market
  { granularity: 'h2', unit: 'week', number: 1, multiple: 60}, // multiple is approximate
  { granularity: 'h2', unit: 'month', number: 1, multiple: 240}, // multiple is approximate
];

const gridLineSteps4h: TimeGridStep[] = [
  { granularity: 'h4', unit: 'hour', number: 4, multiple: 1, parity: true},
  { granularity: 'h4', unit: 'day', number: 1, multiple: 6}, // depends if stock or 24-hour market
  { granularity: 'h4', unit: 'week', number: 1, multiple: 30}, // multiple is approximate
  { granularity: 'h4', unit: 'month', number: 1, multiple: 120}, // multiple is approximate
];

const gridLineSteps1d: TimeGridStep[] = [
  { granularity: 'd1', unit: 'day', number: 1, multiple: 1, parity: true},
  { granularity: 'd1', unit: 'week', number: 1, multiple: 5}, // multiple is approximate
  { granularity: 'd1', unit: 'month', number: 1, multiple: 20}, // multiple is approximate
  { granularity: 'd1', unit: 'month', number: 3, multiple: 60}, // multiple is approximate
];

const gridLineSteps1w: TimeGridStep[] = [
  { granularity: 'w1', unit: 'week', number: 1, multiple: 1, parity: true},
  { granularity: 'w1', unit: 'month', number: 1, multiple: 4}, // multiple is approximate
  { granularity: 'w1', unit: 'month', number: 3, multiple: 12}, // multiple is approximate
  { granularity: 'w1', unit: 'year', number: 1, multiple: 52 }, // multiple is approximate
];

const gridLineSteps1M: TimeGridStep[] = [
  { granularity: 'M1', unit: 'month', number: 1, multiple: 1, parity: true},
  { granularity: 'M1', unit: 'month', number: 3, multiple: 3},
  { granularity: 'M1', unit: 'year', number: 1, multiple: 12 },
  { granularity: 'M1', unit: 'year', number: 5, multiple: 60 },
];

const timeIntervalSpecs: TimeIntervalSpec[] = [
  { key: 'm1', unit: 'minute', value: 1, gridLineSteps: gridLineSteps1m },
  { key: 'm2', unit: 'minute', value: 2, gridLineSteps: gridLineSteps2m },
  { key: 'm3', unit: 'minute', value: 3, gridLineSteps: gridLineSteps3m },
  { key: 'm5', unit: 'minute', value: 5, gridLineSteps: gridLineSteps5m },
  { key: 'm10', unit: 'minute', value: 10, gridLineSteps: gridLineSteps10m },
  { key: 'm15', unit: 'minute', value: 15, gridLineSteps: gridLineSteps15m },
  { key: 'm30', unit: 'minute', value: 30, gridLineSteps: gridLineSteps30m },
  { key: 'h1', unit: 'hour', value: 1, gridLineSteps: gridLineSteps1h },
  { key: 'h2', unit: 'hour', value: 2, gridLineSteps: gridLineSteps2h },
  { key: 'h4', unit: 'hour', value: 4, gridLineSteps: gridLineSteps4h },
  { key: 'd1', unit: 'day', value: 1, gridLineSteps: gridLineSteps1d },
  { key: 'w1', unit: 'week', value: 1, gridLineSteps: gridLineSteps1w },
  { key: 'M1', unit: 'month', value: 1, gridLineSteps: gridLineSteps1M},
];

const getTimeGridStep = (intervalSize: number, granularity: Granularity): TimeGridStep => {
  const timeIntervalSpec = timeIntervalSpecs.find(spec => spec.key === granularity)!;
  if (!timeIntervalSpec) throw new Error(`Invalid interval key: ${granularity}`);

  // i = 1 to skip parity grid line
  for (let i = 1; i < timeIntervalSpec.gridLineSteps.length; i++) {
    const gridLine = timeIntervalSpec.gridLineSteps[i];
    const lineSpacing = intervalSize * gridLine.multiple;
    if (lineSpacing >= MIN_TIME_LINE_SPACING) {
      if (i === 1) {
        const parityGridLine = timeIntervalSpec.gridLineSteps[0];
        const parityLineSpacing = intervalSize * parityGridLine.multiple;
        if (parityLineSpacing >= MIN_TIME_LINE_SPACING) {
          return {...gridLine, parityGridLine};
        }
      }
      return gridLine;
    }
  }
  const lastLine = timeIntervalSpec.gridLineSteps[timeIntervalSpec.gridLineSteps.length - 1];
  return lastLine;
};

export default getTimeGridStep;
