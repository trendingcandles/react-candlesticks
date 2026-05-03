/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import { LayerScale } from '../../config/layer/BaseLayerConfig';
import { LayersTopology } from '../../config/layer/createLayerTopology';
import mapLayersByScale from './mapLayersByScale';

export interface PanelYAxis {
  scale: LayerScale;
  side: 'left' | 'right';
  index: number;
  offsetPx: number;
  width: number;
  labelFormatter: (value: number) => string;
}

export interface PanelYAxes {
  panelId: string;
  leftAxes: PanelYAxis[];
  rightAxes: PanelYAxis[];
  axesByScale: Partial<Record<string, PanelYAxis>>;
  leftTotalWidth: number;
  rightTotalWidth: number;
}

const getPanelYAxes = (panelConfig: Omit<PanelConfigComplete, 'yAxes'>, layersTopology: LayersTopology): PanelYAxes => {
  const { deducedLayerScales } = layersTopology;
  const layersByScale = mapLayersByScale(panelConfig.layers, deducedLayerScales);
  const panelLayersOnePerScale = Object.values(layersByScale).map(scaleLayers => scaleLayers[0]);
  const leftLayers = panelLayersOnePerScale.filter(l => l.yAxis?.side === 'left');
  const rightLayers = panelLayersOnePerScale.filter(l => l.yAxis?.side === 'right');

  const panelYAxes: PanelYAxes = {
    panelId: panelConfig.id,
    leftAxes: [],
    rightAxes: [],
    axesByScale: {},
    leftTotalWidth: 0,
    rightTotalWidth: 0,
  };

  let leftOffsetPx = 0;
  for (let j = 0; j < leftLayers.length; j++) {
    const layer = leftLayers[j];
    const deducedLayerScale = deducedLayerScales[layer.id];
    const panelYAxis: PanelYAxis = {
      scale: deducedLayerScale,
      side: 'left',
      index: j,
      offsetPx: leftOffsetPx,
      width: layer.yAxis!.width,
      labelFormatter: layer.valueLabelFormatter,
    };
    panelYAxes.leftAxes.push(panelYAxis);
    panelYAxes.axesByScale[deducedLayerScale.key] = panelYAxis;
    leftOffsetPx += layer.yAxis!.width;
  }
  panelYAxes.leftTotalWidth = leftOffsetPx;

  let rightOffsetPx = 0;
  for (let j = 0; j < rightLayers.length; j++) {
    const layer = rightLayers[j];
    const deducedLayerScale = deducedLayerScales[layer.id];
    const panelYAxis: PanelYAxis = {
      scale: deducedLayerScale,
      side: 'right',
      index: j,
      offsetPx: rightOffsetPx,
      width: layer.yAxis!.width,
      labelFormatter: layer.valueLabelFormatter,
    };
    panelYAxes.rightAxes.push(panelYAxis);
    panelYAxes.axesByScale[deducedLayerScale.key] = panelYAxis;
    rightOffsetPx += layer.yAxis!.width;
  }
  panelYAxes.rightTotalWidth = rightOffsetPx;

  return panelYAxes;
};

export default getPanelYAxes;
