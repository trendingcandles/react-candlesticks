/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { RsiLayerConfigComplete, RsiLayerConfig, rsiDefaults, REQUIRED_INPUT_KEYS } from './RsiLayerConfig';
import parseValueMarkerConfig from '../../config/valueMarker/parseValueMarkerConfig';
import parseLineConfig from '../../config/elements/line/parseLineConfig';
import parseLegendConfig from '../../config/legend/parseLegendConfig';
import { LegendFieldConfigDefaultsForLayer } from '../../config/legend/LegendFieldConfig';
import createSelector from '../../utils/createSelector';
import { LayersTheme } from '../../config/layer/LayersTheme';
import parseYAxisConfig from '../../config/layer/yAxis/parseYAxisConfig';
import validateLayerInputs from '../../config/layer/validateLayerInputs';
import parseLookback from '../../config/layer/parseLookback';
import { resolveSingleInputSource } from '../../config/layer/inputSourceShorthand';

const parse = (partialConfig: RsiLayerConfig, layersTheme: LayersTheme, panelId: string): RsiLayerConfigComplete => {
  const rsiTheme = layersTheme.rsi;
  const inputs = resolveSingleInputSource('input', partialConfig.inputs, partialConfig.source, rsiDefaults.inputs);
  const period = partialConfig.period ?? rsiDefaults.period;
  const id = partialConfig.id ?? `${rsiDefaults.id}_${panelId}_${period}`;
  const valueLineColorExplicityDefined = typeof partialConfig.series?.value === 'object' ? partialConfig.series.value.color : undefined;

  const defaultLegendLabel = `RSI ${period}`;

  const legendFieldsDefaultsForLayer: Record<string, LegendFieldConfigDefaultsForLayer> = {
    'value': {
      output: 'value',
      label: '',
      color: typeof partialConfig.series?.value === 'object' ? partialConfig.series.value.color : undefined,
      valueSelector: createSelector(`indicators.${id}.value`),
    },
  };

  validateLayerInputs(inputs, REQUIRED_INPUT_KEYS);

  return {
    id,
    type: 'rsi',
    requiredInputKeys: ['input'],
    indicator: true,
    defaultScale: rsiDefaults.defaultScale,
    scale: partialConfig.scale ?? null,
    scalePolicy: 'expandable',
    valueGridLines: [20, 80],
    period,
    offset: 0,
    lookback: parseLookback(period, partialConfig.lookback),
    calculate: partialConfig.calculate ?? rsiDefaults.calculate,
    includeInAutoScale: partialConfig.includeInAutoScale ?? rsiDefaults.includeInAutoScale,
    valueToY: partialConfig.valueToY ?? rsiDefaults.valueToY,
    inputs,
    outputs: partialConfig.outputs ?? rsiDefaults.outputs,
    series: {
      value: parseLineConfig(partialConfig.series?.value, rsiTheme.series.value ?? rsiDefaults.series.value),
    },
    markers: {
      value: parseValueMarkerConfig(partialConfig.markers?.value, rsiTheme.markers.value, valueLineColorExplicityDefined),
    },
    legend: parseLegendConfig(partialConfig.legend, { ...rsiTheme.legend, label: defaultLegendLabel }, legendFieldsDefaultsForLayer),
    yAxis: parseYAxisConfig(partialConfig.yAxis, rsiTheme.yAxis),
    valueLabelFormatter: partialConfig.valueLabelFormatter ?? rsiDefaults.valueLabelFormatter,
  };    
};

export default parse;
