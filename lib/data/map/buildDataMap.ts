/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { DataPoint } from '../../domain/types/DataPoint';
import { Granularity } from '../../domain/types/Granularity';
import isoTimestampToMs from '../../utils/time/isoTimestampToMs';
import { IndexBlock } from '../../domain/types/IndexBlock';
import { DataMap } from '../../domain/types/DataMap';

export interface BuildDataMapOptions {
  weekStartDay?: number;
}

const buildDataMap = (
  data: DataPoint[],
  granularity: Granularity,
  blocks: IndexBlock[],
  options?: BuildDataMapOptions // eslint-disable-line @typescript-eslint/no-unused-vars
): DataMap => {
  if (blocks.length === 0) {
    return {
      granularity,
      rawData: data,
      dataIndexByBar: new Int32Array(0),
      ohlcvs: {
        timestamp: new Float64Array(0),
        timeLabel: new Float64Array(0),
        open: new Float64Array(0),
        high: new Float64Array(0),
        low: new Float64Array(0),
        close: new Float64Array(0),
        volume: new Float64Array(0),
      },
      lastBarWithDataIndex: undefined,
    };
  }

  const sortedBlocks = [...blocks].sort((a, b) => a.startIndex - b.startIndex);

  const lastBlock = sortedBlocks[sortedBlocks.length - 1];
  const maxBarIndex = lastBlock.startIndex + lastBlock.bars;

  const dataIndexByBar = new Int32Array(maxBarIndex);
  dataIndexByBar.fill(-1);

  const timestamps = new Float64Array(maxBarIndex);
  const timeLabels = new Float64Array(maxBarIndex);
  const openData = new Float64Array(maxBarIndex);
  const highData = new Float64Array(maxBarIndex);
  const lowData = new Float64Array(maxBarIndex);
  const closeData = new Float64Array(maxBarIndex);
  const volumeData = new Float64Array(maxBarIndex);

  timestamps.fill(NaN);
  timeLabels.fill(NaN);
  openData.fill(NaN);
  highData.fill(NaN);
  lowData.fill(NaN);
  closeData.fill(NaN);
  volumeData.fill(NaN);

  let lastBarWithDataIndex: number | undefined = undefined;

  const isCalendar =
    granularity === 'd1' || granularity === 'w1' || granularity === 'M1';

  if (isCalendar) {
    const blockStarts = sortedBlocks.map(b => b.startTs);
    const blockEnds = sortedBlocks.map(b => b.endTs);

    const findBlockIndex = (ts: number) => {
      let lo = 0, hi = sortedBlocks.length - 1;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (ts < blockStarts[mid]) hi = mid - 1;
        else if (ts > blockEnds[mid]) lo = mid + 1;
        else return mid;
      }
      return -1;
    };

    for (let i = 0; i < data.length; i++) {
      const ts = isoTimestampToMs(data[i].time);
      const blockIndex = findBlockIndex(ts);
      if (blockIndex === -1) continue;

      const block = sortedBlocks[blockIndex];
      const barIndex = block.startIndex;
      const dp = data[i];

      dataIndexByBar[barIndex] = i;
      timestamps[barIndex] = ts;
      timeLabels[barIndex] = block.labelTs ?? block.startTs;
      openData[barIndex] = dp.open;
      highData[barIndex] = dp.high;
      lowData[barIndex] = dp.low;
      closeData[barIndex] = dp.close;
      volumeData[barIndex] = dp.volume;

      lastBarWithDataIndex = barIndex;
    }
  } else {
    // Intraday: exact timestamp match
    const dataIndexByTs = new Map<number, number>();
    for (let i = 0; i < data.length; i++) {
      const ts = isoTimestampToMs(data[i].time);
      dataIndexByTs.set(ts, i);
    }

    for (let blockIndex = 0; blockIndex < sortedBlocks.length; blockIndex++) {
      const block = sortedBlocks[blockIndex];

      for (
        let barIndex = block.startIndex;
        barIndex < block.startIndex + block.bars;
        barIndex++
      ) {
        const timestampMs =
          block.startTs + (barIndex - block.startIndex) * block.barSizeMs;

        const dataIndex = dataIndexByTs.get(timestampMs);
        if (dataIndex === undefined) continue;

        const dp = data[dataIndex];
        dataIndexByBar[barIndex] = dataIndex;
        timestamps[barIndex] = timestampMs;
        timeLabels[barIndex] = timestampMs;
        openData[barIndex] = dp.open;
        highData[barIndex] = dp.high;
        lowData[barIndex] = dp.low;
        closeData[barIndex] = dp.close;
        volumeData[barIndex] = dp.volume;

        lastBarWithDataIndex = barIndex;
      }
    }
  }

  return {
    granularity,
    rawData: data,
    dataIndexByBar,
    ohlcvs: {
      timestamp: timestamps,
      timeLabel: timeLabels,
      open: openData,
      high: highData,
      low: lowData,
      close: closeData,
      volume: volumeData,
    },
    lastBarWithDataIndex,
  };
};

export default buildDataMap;
