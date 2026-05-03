/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { DataPoint } from './DataPoint';
import { LayersData } from './LayersData';
import DataPointInfo from './DataPointInfo';
import { IndexProvider } from './IndexProvider';
import { TimeScale } from './TimeScale';
import { DataMap } from './DataMap';

export type ViewportData = {
  indexProvider: IndexProvider;
  timeScale: TimeScale;
  data: DataPoint[];
  dataMap: DataMap;
  layersData: LayersData;
  scrollOffset: number;
  startBarIndex: number;
  endBarIndex: number;
  xToDataPoint: (x: number) => DataPointInfo;
};

export default ViewportData;
