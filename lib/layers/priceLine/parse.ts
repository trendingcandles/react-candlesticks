/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { PriceLineLayerConfig, PriceLineLayerConfigComplete, priceLineLayerDefaults, REQUIRED_INPUT_KEYS } from './PriceLineLayerConfig';
import parseLineConfig from '../../config/elements/line/parseLineConfig';
import parseValueMarkerConfig from '../../config/valueMarker/parseValueMarkerConfig';
import parseLegendConfig from '../../config/legend/parseLegendConfig';
import { LegendFieldConfigDefaultsForLayer } from '../../config/legend/LegendFieldConfig';
import createSelector from '../../utils/createSelector';
import { LayersTheme } from '../../config/layer/LayersTheme';
import parseYAxisConfig from '../../config/layer/yAxis/parseYAxisConfig';
import validateLayerInputs from '../../config/layer/validateLayerInputs';

const parse = (partialConfig: PriceLineLayerConfig, layersTheme: LayersTheme, panelId: string): PriceLineLayerConfigComplete => {
  const priceLineTheme = layersTheme.priceLine;

  const id = partialConfig.id ?? `${priceLineLayerDefaults.id}_${panelId}`;
  const inputs = partialConfig.inputs ?? priceLineLayerDefaults.inputs;

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
    type: 'price:line',
    indicator: false,
    requiredInputKeys: ['input'],
    defaultScale: priceLineLayerDefaults.defaultScale,
    scale: partialConfig.scale ?? null,
    scalePolicy: 'fixed',
    series: {
      value: parseLineConfig(partialConfig.series?.value, priceLineTheme.series.value),
    },
    valueToY: partialConfig.valueToY ?? priceLineLayerDefaults.valueToY,
    markers: {
      value: parseValueMarkerConfig(partialConfig.markers?.value, priceLineTheme.markers.value),
    },
    legend: parseLegendConfig(partialConfig.legend, { ...priceLineTheme.legend, label: defaultLegendLabel }, legendFieldsDefaultsForLayer),
    yAxis: parseYAxisConfig(partialConfig.yAxis, priceLineTheme.yAxis),
    valueLabelFormatter: partialConfig.valueLabelFormatter ?? priceLineLayerDefaults.valueLabelFormatter,
    inputs,
    outputs: priceLineLayerDefaults.outputs,
    period: 1,
    offset: 0,
    lookback: 0,
    calculate: true,
    includeInAutoScale: true,
  };    
};

export default parse;
