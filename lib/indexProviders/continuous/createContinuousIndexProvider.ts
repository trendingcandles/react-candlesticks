/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { DataPoint } from '../../domain/types/DataPoint';
import { Granularity } from '../../domain/types/Granularity';
import buildDataMap from '../../data/map/buildDataMap';
import isoTimestampToMs from '../../utils/time/isoTimestampToMs';
import { IndexProvider } from '../../domain/types/IndexProvider';
import findClosestIndex from './findClosestIndex';
import indexToTimestamp from './indexToTimestamp';
import continuousTimeScale from '../../timeScale/continuous/continuousTimeScale';
import { IndexBlock } from '../../domain/types/IndexBlock';

const createContinuousIndexProvider = (
  data: DataPoint[],
  granularity: Granularity,
  // _showExtendedSessions: boolean, // eslint-disable-line @typescript-eslint/no-unused-vars
): IndexProvider => {
  // One bar per data point, in data order. No synthetic intervals.
  const blocks: IndexBlock[] = data.map((dp, i) => {
    const ts = isoTimestampToMs(dp.time);
    return {
      session: null,
      startIndex: i,
      bars: 1,
      startTs: ts,
      endTs: ts,
      labelTs: ts,
      barSizeMs: 1,
    };
  });

  const dataMap = buildDataMap(
    data,
    granularity,
    blocks,
    { weekStartDay: 1 },
  );

  const barsLength = dataMap.dataIndexByBar.length;
  const firstDataPointIndex = barsLength > 0 ? 0 : undefined;
  const lastDataPointIndex = barsLength > 0 ? barsLength - 1 : undefined;

  return {
    // Keep interface compatibility if these are currently required.
    marketHoursConfigComplete: undefined as unknown, // not implemented in core
    sessionsAndBlocks: undefined as unknown as unknown,

    dataMap,
    barsLength,
    firstDataPointIndex,
    lastDataPointIndex,

    indexToTimestamp: (index: number) => indexToTimestamp(index, dataMap),
    findClosestIndex: (timestamp: number) => findClosestIndex(timestamp, dataMap),
    getTimescale: (intervalSize: number, scrollOffset: number, viewportWidth: number) =>
      continuousTimeScale(dataMap, granularity, intervalSize, scrollOffset, viewportWidth),
  };
};

export default createContinuousIndexProvider;
