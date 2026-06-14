/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { BaseLayerConfigComplete, LayerScale } from '../../config/layer/BaseLayerConfig';
import { LayerDataInstance, LayersData } from '../../domain/types/LayersData';
import { DataMap } from '../../domain/types/DataMap';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import getMinAndMaxValues from './getMinAndMaxValues';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';

const calculateLayerMetrics = (
  dataMap: DataMap,
  layerData: LayersData,
  startBarIndex: number,
  endBarIndex: number,
  layerConfigs: BaseLayerConfigComplete[],
  layerConfig0: BaseLayerConfigComplete,
  panelMetrics: PanelMetrics,
  scale: LayerScale,
): LayerMetrics | null => {

  const { ohlcvs } = dataMap;
  const { layerDataInstances: layerDataInstancesById } = layerData;
  const layerDataInstances: LayerDataInstance[] = layerConfigs.map(layerConfig => layerDataInstancesById[layerConfig.id]);

  const { paddedHeightPx, paddedTopPx } = panelMetrics;

  const { valueToY: getValueToY } = layerConfig0;

  const { min, max } = getMinAndMaxValues(ohlcvs, layerDataInstances, scale, startBarIndex, endBarIndex);

  const valueRange = max - min;

  if (valueRange === 0) return null;

  const valueToY = getValueToY(min, max, paddedTopPx, paddedHeightPx);

  return {
    valueToY,
    min,
    max,
  };
};

export default calculateLayerMetrics;
