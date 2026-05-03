/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { InputSource } from '../../config/layer/BaseLayerConfig';
import { DataMap } from '../../domain/types/DataMap';
import layers from '../../layers/layers';
import { LayerDataInstance, LayerInputSeries, LayersData } from '../../domain/types/LayersData';
import createPriceVolumeDerivedLayerCalculationContext from './createPriceVolumeDerivedLayerCalculationContext';

export interface CalculationContext {
  resolve(input: InputSource): LayerInputSeries | null;
}

const resolveInputs = (
  inputs: InputSource[],
  context: CalculationContext
): Record<string, LayerInputSeries> => {
  const result: Record<string, LayerInputSeries> = {};

  for (const input of inputs) {
    const resolvedInputSeries = context.resolve(input);
    if (resolvedInputSeries === null) {
      throw new Error(`Failed to resolve input series for input ${input.key}`);
    }
    result[input.key] = resolvedInputSeries;
  }

  return result;
};

const updateLayerDataInstance = (
  layersData: LayersData,
  layerDataInstance: LayerDataInstance,
  dataMap: DataMap,
  context: CalculationContext,
  startBarIndex: number,
  endBarIndex: number,
) => {
  const {
    layerType,
    layerConfig,
    outputValues,
    computedStartIndex,
    computedEndIndex,
  } = layerDataInstance;

  const calculateFunction = layers[layerType].calculate2;
  if (!calculateFunction) {
    return;
  }

  if (startBarIndex > computedStartIndex && endBarIndex < computedEndIndex)
    return;

  if (!Object.keys(layerDataInstance.inputs).length) {
    layerDataInstance.inputs = resolveInputs(layerConfig.inputs, context);
  }

  calculateFunction(
    layerConfig,
    layerDataInstance.inputs,
    outputValues,
    startBarIndex,
    endBarIndex,
  );

  layerDataInstance.computedStartIndex = Math.min(
    layerDataInstance.computedStartIndex,
    startBarIndex,
  );
  layerDataInstance.computedEndIndex = Math.max(
    layerDataInstance.computedEndIndex,
    endBarIndex,
  );
};

export const updateLayersData = (layersData: LayersData, dataMap: DataMap, startBarIndex: number, endBarIndex: number) => {
  const calcContext = createPriceVolumeDerivedLayerCalculationContext(dataMap, layersData);

  const { layerDataInstances, layersTopology } = layersData;

  const { layersInDependencyOrder } = layersTopology;

  for (const layerConfig of layersInDependencyOrder) {
    const layerId = layerConfig.id;
    const layerDataInstance = layerDataInstances[layerId];
    updateLayerDataInstance(
      layersData,
      layerDataInstance,
      dataMap,
      calcContext,
      startBarIndex,
      endBarIndex,
    );
  }
};
