/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerScale } from '../../config/layer/BaseLayerConfig';
import { LayerDataInstance } from '../../domain/types/LayersData';
import { OHLCVData } from '../../domain/types/DataMap';
import getIndicatorScalingValueArrays from './getIndicatorScalingValues';

const getMinValue = (
  valueArrays: Float64Array[],
  startBarIndex: number,
  endBarIndex: number,
) => {
  let min = Number.POSITIVE_INFINITY;
  for (let barIndex = startBarIndex; barIndex <= endBarIndex; barIndex++) {
    for (let arrayIndex = 0; arrayIndex < valueArrays.length; arrayIndex++) {
      const valueArray = valueArrays[arrayIndex];
      const value = valueArray[barIndex];
      if (value < min) {
        min = value;
      }
    }
  }
  return min;
};

const getMaxValue = (
  valueArrays: Float64Array[],
  startBarIndex: number,
  endBarIndex: number,
) => {
  let max = Number.NEGATIVE_INFINITY;
  for (let barIndex = startBarIndex; barIndex <= endBarIndex; barIndex++) {
    for (let arrayIndex = 0; arrayIndex < valueArrays.length; arrayIndex++) {
      const valueArray = valueArrays[arrayIndex];
      const value = valueArray[barIndex];
      if (value > max) {
        max = value;
      }
    }
  }
  return max;
};

const getMinAndMaxValues = (
  ohlcvs: OHLCVData,
  layerDataInstances: LayerDataInstance[],
  scale: LayerScale,
  startBarIndex: number,
  endBarIndex: number,
) => {

  let minValue: number;
  let maxValue: number;

  if (scale.domain === 'price' && scale.range.type === 'auto') {
    const indicatorValueArrays = getIndicatorScalingValueArrays(layerDataInstances);
    minValue = getMinValue([ohlcvs.low, ...indicatorValueArrays], startBarIndex, endBarIndex);
    maxValue = getMaxValue([ohlcvs.high, ...indicatorValueArrays], startBarIndex, endBarIndex);
  } else if (scale.domain === 'volume' && scale.range.type === 'positive') {
    const indicatorValueArrays = getIndicatorScalingValueArrays(layerDataInstances);
    minValue = 0;
    maxValue = getMaxValue([ohlcvs.volume, ...indicatorValueArrays], startBarIndex, endBarIndex);
  } else if (scale.domain === 'value' && scale.range.type === 'bounded') {
    minValue = scale.range.min;
    maxValue = scale.range.max;
  } else if (scale.domain === 'value' && scale.range.type === 'auto') {
    const indicatorValueArrays = getIndicatorScalingValueArrays(layerDataInstances);
    minValue = getMinValue(indicatorValueArrays, startBarIndex, endBarIndex);
    maxValue = getMaxValue(indicatorValueArrays, startBarIndex, endBarIndex);
  } else if (scale.domain === 'value' && scale.range.type === 'zero-centered') {
    const indicatorValueArrays = getIndicatorScalingValueArrays(layerDataInstances);
     minValue = getMinValue(indicatorValueArrays, startBarIndex, endBarIndex);
     maxValue = getMaxValue(indicatorValueArrays, startBarIndex, endBarIndex);
  } else if (scale.domain === 'value' && scale.range.type === 'positive') {
    const indicatorValueArrays = getIndicatorScalingValueArrays(layerDataInstances);
    minValue = 0;
    maxValue = getMaxValue(indicatorValueArrays, startBarIndex, endBarIndex);
  }
  else {
    throw new Error(`Invalid layer scale ${scale.domain} - ${scale.range.type}`);
  }

  return {
    min: minValue,
    max: maxValue,
  };
};

export default getMinAndMaxValues;
