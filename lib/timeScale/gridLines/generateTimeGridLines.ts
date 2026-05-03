/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { TimeGridLine } from '../../domain/types/gridLine/TimeGridLine';
import { TimeGridStep } from '../../domain/types/gridLine/TimeGridStep';
import isTimeGridLine, { UNIT_FN } from './isTimeGridLine';
import { LocalDateTime } from '../../domain/types/LocalDateTime';
import utcToLocal from '../../utils/time/utcToLocal';
import { DataMap } from '../../domain/types/DataMap';

function generateTimeGridLines(
  dataMap: DataMap,
  startBarIndex: number,
  endBarIndex: number,
  step: TimeGridStep,
  intervalSize: number,
  scrollOffset: number,
  viewportWidth: number,
  timeZoneId: string,
): TimeGridLine[] {
  const gridLines: TimeGridLine[] = [];

  const { ohlcvs: { timestamp: timestamps, timeLabel: timeLabels } } = dataMap;
  
  // let prevTimestamp: number | undefined = undefined;
  let prevLocalDateTime: LocalDateTime | undefined = undefined;
  let prevUnitValue = prevLocalDateTime ? UNIT_FN[step.unit](prevLocalDateTime) : undefined;
  
  // Generate grid lines at every bar index (or use step to space them out)
  for (let barIndex = startBarIndex; barIndex <= endBarIndex; barIndex++) {
    const timestamp = timestamps[barIndex];
    const labelTs = timeLabels[barIndex];

    if (isNaN(timestamp)) continue;

    const localDateTime = utcToLocal(labelTs, timeZoneId);

    const timeGridLine = isTimeGridLine(step, localDateTime, prevLocalDateTime, prevUnitValue);
    if (timeGridLine) {
      gridLines.push({
        step,
        barIndex,
        timestamp,
        major: timeGridLine.major,
      });
    }

    prevLocalDateTime = localDateTime;
    prevUnitValue = UNIT_FN[step.unit](localDateTime);
  }

  return gridLines;
}

export default generateTimeGridLines;
