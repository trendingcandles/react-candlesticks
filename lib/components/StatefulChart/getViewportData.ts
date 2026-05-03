/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import DataPointInfo from '../../domain/types/DataPointInfo';
import { IndexProvider } from '../../domain/types/IndexProvider';
import { TimeScale } from '../../domain/types/TimeScale';
import ViewportData from '../../domain/types/ViewportData';
import { LayersData } from '../../domain/types/LayersData';

function getViewportData(
  indexProvider: IndexProvider,
  timeScale: TimeScale,
  layersData: LayersData,
  scrollOffset: number,
  viewportWidth: number,
  intervalSize: number,
): ViewportData {

  const { dataMap } = indexProvider;
  const { xToBarIndex } = timeScale;
  const { rawData: data, ohlcvs } = dataMap;
  const { layerDataInstances } = layersData;

  // Calculate visible bar index range
  const startBarIndex = Math.floor(scrollOffset / intervalSize);
  const endBarIndex = Math.ceil((scrollOffset + viewportWidth) / intervalSize);
  
  const xToDataPoint = (x: number): DataPointInfo => {
    const barIndex = xToBarIndex(x);
    const data: DataPointInfo = {
      x,
      barIndex,
      ohlcvs,
      layerDataInstances,
    };
    return data;
  };
  
  return {
    indexProvider,
    timeScale,
    data,
    dataMap,
    layersData,
    scrollOffset,
    startBarIndex,
    endBarIndex,
    xToDataPoint,
  };
}

export default getViewportData;
