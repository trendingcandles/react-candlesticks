/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../config/chart/ChartConfig';
import { LayerHit, LayerHitTestContext } from '../../config/layer/Layer';
import { LayerRegistry } from '../../config/layer/LayerRegistry';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import { Layout } from '../../domain/types/Layout';
import layers from '../../layers/layers';
import ViewportData from '../../domain/types/ViewportData';
import createLayerHitTestContext from './createLayerHitTestContext';
import { MetricsByPanel } from '../drawing/hitTestDrawings';

export interface LayerHitResult {
  hit: LayerHit;
  context: LayerHitTestContext;
}

const hitTestLayers = (
  clientX: number,
  clientY: number,
  chartX: number,
  chartY: number,
  chartConfig: ChartConfigComplete,
  panels: PanelConfigComplete[],
  layout: Layout,
  viewportData: ViewportData,
  metricsByPanel: MetricsByPanel,
  layerRegistry: LayerRegistry = layers,
): LayerHitResult | null => {
  if (
    chartX < layout.drawingAreaX ||
    chartX > layout.drawingAreaX1 ||
    chartY < layout.drawingAreaY ||
    chartY > layout.drawingAreaY1
  ) {
    return null;
  }

  const panelX = chartX - layout.drawingAreaX;

  for (let panelIndex = panels.length - 1; panelIndex >= 0; panelIndex--) {
    const panelConfig = panels[panelIndex];
    const metrics = metricsByPanel[panelConfig.id];
    if (!metrics) continue;

    const { panelMetrics, layerMetricsByScale } = metrics;
    if (chartY < panelMetrics.topPx || chartY > panelMetrics.bottomPx) continue;

    for (let layerIndex = panelConfig.layers.length - 1; layerIndex >= 0; layerIndex--) {
      const layerConfig = panelConfig.layers[layerIndex];
      const layer = viewportData.layersData?.layerRegistry?.[layerConfig.type] ?? layerRegistry[layerConfig.type];
      if (!layer?.hitTest) continue;

      const scaleKey = viewportData.layersData.layersTopology.deducedLayerScales[layerConfig.id]?.key;
      const layerMetrics = scaleKey ? layerMetricsByScale[scaleKey] : undefined;
      if (!layerMetrics) continue;

      const hitTestContext = createLayerHitTestContext({
        clientX,
        clientY,
        chartX,
        chartY,
        panelX,
        panelY: chartY - panelMetrics.topPx,
        chartConfig,
        panelConfig,
        layerConfig,
        layout,
        viewportData,
        panelMetrics,
        layerMetrics,
      });
      const hit = layer.hitTest(hitTestContext);

      if (hit) {
        return {
          hit: {
            ...hit,
            layerId: layerConfig.id,
            layerType: layerConfig.type,
            panelId: panelConfig.id,
          },
          context: hitTestContext,
        };
      }
    }
  }

  return null;
};

export default hitTestLayers;
