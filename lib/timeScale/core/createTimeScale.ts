/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { DataMap } from '../../domain/types/DataMap';
import { Granularity } from '../../domain/types/Granularity';
import { TimeGridLine } from '../../domain/types/gridLine/TimeGridLine';
import { TimeScale } from '../../domain/types/TimeScale';
import generateTimeGridLines from '../gridLines/generateTimeGridLines';
import getTimeGridStep from '../gridLines/getTimeGridStep';

interface CreateTimeScaleParams {
  dataMap: DataMap;
  granularity: Granularity;
  intervalSize: number;
  scrollOffset: number;
  viewportWidth: number;
  timeZoneId: string;
  timestampToIndex: (timestamp: number, nearest?: boolean) => number | undefined;
  sessionsAndBlocks?: unknown;
}

const createTimeScale = ({
  dataMap,
  granularity,
  intervalSize,
  scrollOffset,
  viewportWidth,
  timeZoneId,
  timestampToIndex,
  sessionsAndBlocks,
}: CreateTimeScaleParams): TimeScale => {
  const halfInterval = intervalSize / 2;
  const step = getTimeGridStep(intervalSize, granularity);

  const startIntervalIndex = scrollOffset / intervalSize;
  const endIntervalIndex = startIntervalIndex + viewportWidth / intervalSize;

  const startBarIndex = Math.floor(startIntervalIndex);
  const endBarIndex = Math.ceil(endIntervalIndex);

  const gridLines: TimeGridLine[] = generateTimeGridLines(
    dataMap,
    startBarIndex,
    endBarIndex,
    step,
    intervalSize,
    scrollOffset,
    viewportWidth,
    timeZoneId,
  );

  const xToBarIndex = (x: number, round: boolean = true): number => {
    const absoluteX = x + scrollOffset;
    return Math[round ? 'round' : 'floor'](absoluteX / intervalSize);
  };

  const xToIntervalX = (x: number, localScrollOffset: number): number => {
    const absoluteX = x + localScrollOffset;
    const intervalIndex = Math.round(absoluteX / intervalSize);
    return intervalIndex * intervalSize - localScrollOffset;
  };

  const getLastVisibleBarIndex = (lastValidBarIndex: number): number => {
    const lastBarX = lastValidBarIndex * intervalSize - scrollOffset;
    const midX = lastBarX - halfInterval;
    return midX >= viewportWidth ? lastValidBarIndex - 1 : lastValidBarIndex;
  };

  return {
    metadata: {
      granularity,
      intervalSize,
      halfInterval,
      scrollOffset,
      viewportWidth,
    },

    // Keep compatibility with current required type.
    sessionsAndBlocks: (sessionsAndBlocks ?? (undefined as unknown)),

    startIntervalIndex,
    endIntervalIndex,
    startBarIndex,
    endBarIndex,
    gridLines,

    xToBarIndex,
    xToIntervalX,
    timestampToIndex,
    getLastVisibleBarIndex,
  };
};

export default createTimeScale;
