/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { TimeGridLine } from './TimeGridLine';

const getUnitValue = (d: Date, unit: TimeGridLine['unit']) => {
  switch (unit) {
    case 'minute': return Math.floor(d.getTime() / 60000);
    case 'hour': return Math.floor(d.getTime() / 3600000);
    case 'day': return Math.floor(d.getTime() / 86400000);
    case 'week': {
      const epoch = new Date(Date.UTC(1970, 0, 4)); // Sunday Jan 4, 1970
      return Math.floor((d.getTime() - epoch.getTime()) / (7 * 86400000));
    }
    case 'month': return d.getUTCFullYear() * 12 + d.getUTCMonth();
    case 'year': return d.getUTCFullYear();
  }
};

const isTimeGridLine = (gridLine: TimeGridLine, date: Date, prevDate?: Date): TimeGridLine | false => {
  if (!prevDate) return false;

  const currentUnitValue = getUnitValue(date, gridLine.unit);
  const prevUnitValue = getUnitValue(prevDate, gridLine.unit);

  // need to use modulus for 30-minute, 2-hour, etc, (even numbers) where we can't rely on even/odd
  gridLine.even = gridLine.modulus ? currentUnitValue % gridLine.modulus === 0 : currentUnitValue % 2 === 0; // not used

  const crossedBoundary = Math.floor(currentUnitValue / gridLine.number) > Math.floor(prevUnitValue / gridLine.number);

  if (crossedBoundary) {
    let secondaryUnit: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year' | undefined = undefined;
    if (gridLine.unit === 'minute' || gridLine.unit === 'hour') {
      secondaryUnit = 'day'
    } else if (gridLine.unit === 'day' || gridLine.unit === 'week') {
      secondaryUnit = 'month'
    } else if (gridLine.unit === 'month') {
      secondaryUnit = 'year'
    }
    if (secondaryUnit) {
      const currentSecondaryUnitValue = getUnitValue(date, secondaryUnit);
      const prevSecondaryUnitValue = getUnitValue(prevDate, secondaryUnit);
      gridLine.isSecondaryLabel = currentSecondaryUnitValue > prevSecondaryUnitValue;
    }
  }

  return crossedBoundary ? gridLine : false;
};

export default isTimeGridLine;
