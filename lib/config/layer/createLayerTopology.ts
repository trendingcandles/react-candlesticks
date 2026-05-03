/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { PanelConfigComplete } from '../panel/PanelConfig';
import { LayerScale } from './BaseLayerConfig';
import { LayerConfigComplete } from './LayerConfig';

const getLayersById = (layers: LayerConfigComplete[]): Record<string, LayerConfigComplete> => {
  const layersById: Record<string, LayerConfigComplete> = {};
  for (const layer of layers) {
    layersById[layer.id] = layer;
  }
  return layersById;
};

// layer inputs not implemented in core
const getLayerDependencies = (): string[] => [];

const topoSortLayers = (
  layersById: Record<string, LayerConfigComplete>,
): string[] => {
  const visited = new Set<string>();
  const temp = new Set<string>();
  const result: string[] = [];

  const visit = (id: string) => {
    if (visited.has(id)) return;
    if (temp.has(id)) {
      throw new Error(`Circular layer dependency at ${id}`);
    }

    temp.add(id);

    const deps = getLayerDependencies();
    for (const dep of deps) {
      if (!layersById[dep]) {
        throw new Error(`Layer ${id} depends on missing layer ${dep}`);
      } else if (dep === id) {
        throw new Error(`Layer ${dep} cannot depend on itself`);
      }
      visit(dep);
    }

    temp.delete(id);
    visited.add(id);
    result.push(id);
  };

  for (const layerId in layersById) {
    visit(layerId);
  }

  return result;
};

const deduceLayerScale = (
  layer: LayerConfigComplete,
): LayerScale => {

  // 1. Explicit scale
  if (layer.scale) {
    return layer.scale;
  }

  // 2. Layer inputs (not implemented in core)

  // 3. Everything else uses its declared default
  return layer.defaultScale;
};

const deduceLayerScales = (
  layersInDependencyOrder: LayerConfigComplete[],
): Record<LayerConfigComplete['id'], LayerScale> => {
  const deducedLayerScales: Record<string, LayerScale> = {}

  for (const layer of layersInDependencyOrder) {
    const scale = deduceLayerScale(
      layer,
    );
    deducedLayerScales[layer.id] = scale;
  }

  return deducedLayerScales;
};

export interface LayersTopology {
  layersInDependencyOrder: LayerConfigComplete[];
  deducedLayerScales: Record<LayerConfigComplete['id'], LayerScale>;
}

const createLayerTopology = (panels: (PanelConfigComplete | Omit<PanelConfigComplete, 'yAxes'>)[]): LayersTopology => {

  const layers = panels.flatMap(p => p.layers);
  const layerIds = layers.map(layer => layer.id);
  const duplicateLayerIds = layerIds.filter((id, index) => layerIds.indexOf(id) !== index);

  if (duplicateLayerIds.length > 0) {
    throw new Error(`Duplicate layer ids found: ${[...new Set(duplicateLayerIds)].join(', ')}`);
  }

  const layersById = getLayersById(layers);

  const sortedLayerIds = topoSortLayers(layersById);

  const layersInDependencyOrder = sortedLayerIds.map(layerId => layersById[layerId]);

  const deducedLayerScales = deduceLayerScales(layersInDependencyOrder);

  return {
    layersInDependencyOrder: layersInDependencyOrder,
    deducedLayerScales: Object.freeze(deducedLayerScales),
  };
};

export default createLayerTopology;
