/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { AreaFillConfig, AreaFillConfigComplete, AreaLayerConfig, AreaLayerConfigComplete, areaLayerDefaults, REQUIRED_INPUT_KEYS } from './AreaLayerConfig';
import parseLineConfig from '../../config/elements/line/parseLineConfig';
import parseValueMarkerConfig from '../../config/valueMarker/parseValueMarkerConfig';
import parseLegendConfig from '../../config/legend/parseLegendConfig';
import { LegendFieldConfigDefaultsForLayer } from '../../config/legend/LegendFieldConfig';
import createSelector from '../../utils/createSelector';
import { LayersTheme } from '../../config/layer/LayersTheme';
import parseYAxisConfig from '../../config/layer/yAxis/parseYAxisConfig';
import validateLayerInputs from '../../config/layer/validateLayerInputs';

const parseAreaFillConfig = (
  partialConfig: false | AreaFillConfig = {},
  defaults: AreaFillConfigComplete,
): null | AreaFillConfigComplete => {
  if (partialConfig === false) return null;

  return {
    topColor: partialConfig.topColor ?? defaults.topColor,
    bottomColor: partialConfig.bottomColor ?? defaults.bottomColor,
  };
};

const parse = (partialConfig: AreaLayerConfig, layersTheme: LayersTheme, panelId: string): AreaLayerConfigComplete => {
  const areaTheme = layersTheme.area;

  const id = partialConfig.id ?? `${areaLayerDefaults.id}_${panelId}`;
  const inputs = partialConfig.inputs ?? areaLayerDefaults.inputs;

  const defaultLegendLabel = 'Price';

  const legendFieldsDefaultsForLayer: Record<string, LegendFieldConfigDefaultsForLayer> = {
    'price': {
      output: 'price',
      label: 'Price',
      valueSelector: createSelector(`close`),
    },
  };

  validateLayerInputs(inputs, REQUIRED_INPUT_KEYS);

  return {
    id,
    type: 'price:area',
    indicator: false,
    requiredInputKeys: ['input'],
    defaultScale: areaLayerDefaults.defaultScale,
    scale: partialConfig.scale ?? null,
    scalePolicy: 'fixed',
    series: {
      value: {
        line: parseLineConfig(partialConfig.series?.value?.line, areaTheme.series.value.line),
        fill: parseAreaFillConfig(partialConfig.series?.value?.fill, areaTheme.series.value.fill),
      },
    },
    valueToY: partialConfig.valueToY ?? areaLayerDefaults.valueToY,
    markers: {
      value: parseValueMarkerConfig(partialConfig.markers?.value, areaTheme.markers.value),
    },
    legend: parseLegendConfig(partialConfig.legend, { ...areaTheme.legend, label: defaultLegendLabel }, legendFieldsDefaultsForLayer),
    yAxis: parseYAxisConfig(partialConfig.yAxis, areaTheme.yAxis),
    valueLabelFormatter: partialConfig.valueLabelFormatter ?? areaLayerDefaults.valueLabelFormatter,
    inputs,
    outputs: areaLayerDefaults.outputs,
    period: 1,
    offset: 0,
    lookback: 0,
    calculate: true,
    includeInAutoScale: true,
    onElementHover: partialConfig.onElementHover,
    onElementClick: partialConfig.onElementClick,
  };
};

export default parse;
