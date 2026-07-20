/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import parseLookback from '../../config/layer/parseLookback';
import { AtrLayerConfig, AtrLayerConfigComplete, REQUIRED_INPUT_KEYS, atrDefaults } from './AtrLayerConfig';
import parseValueMarkerConfig from '../../config/valueMarker/parseValueMarkerConfig';
import parseLineConfig from '../../config/elements/line/parseLineConfig';
import parseLegendConfig from '../../config/legend/parseLegendConfig';
import { LegendFieldConfigDefaultsForLayer } from '../../config/legend/LegendFieldConfig';
import createSelector from '../../utils/createSelector';
import { LayersTheme } from '../../config/layer/LayersTheme';
import parseYAxisConfig from '../../config/layer/yAxis/parseYAxisConfig';
import validateLayerInputs from '../../config/layer/validateLayerInputs';
import { sourceFieldToInput } from '../../config/layer/inputSourceShorthand';

const parse = (partialConfig: AtrLayerConfig, layersTheme: LayersTheme, panelId: string): AtrLayerConfigComplete => {
  const atrTheme = layersTheme.atr;
  const highSource = partialConfig.source?.high;
  const lowSource = partialConfig.source?.low;
  const closeSource = partialConfig.source?.close;
  const inputs = partialConfig.inputs ?? [
    sourceFieldToInput('high', highSource ?? 'high'),
    sourceFieldToInput('low', lowSource ?? 'low'),
    sourceFieldToInput('close', closeSource ?? 'close'),
  ];
  const period = partialConfig.period ?? atrDefaults.period;
  const id = partialConfig.id ?? `${atrDefaults.id}_${panelId}_${period}`;
  const valueLineColorExplicityDefined = typeof partialConfig.series?.value === 'object' ? partialConfig.series.value.color : undefined;

  const defaultLegendLabel = `ATR ${period}`;

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
    type: 'atr',
    requiredInputKeys: REQUIRED_INPUT_KEYS,
    indicator: true,
    defaultScale: atrDefaults.defaultScale,
    scale: partialConfig.scale ?? null,
    scalePolicy: 'derived',
    period,
    offset: 0,
    lookback: parseLookback(period, partialConfig.lookback ?? atrDefaults.lookback),
    calculate: partialConfig.calculate ?? atrDefaults.calculate,
    includeInAutoScale: partialConfig.includeInAutoScale ?? atrDefaults.includeInAutoScale,
    valueToY: partialConfig.valueToY ?? atrDefaults.valueToY,
    inputs,
    outputs: partialConfig.outputs ?? atrDefaults.outputs,
    series: {
      value: parseLineConfig(partialConfig.series?.value, atrTheme.series.value),
    },
    markers: {
      value: parseValueMarkerConfig(partialConfig.markers?.value ?? false, atrTheme.markers.value, valueLineColorExplicityDefined),
    },
    legend: parseLegendConfig(partialConfig.legend, { ...atrTheme.legend, label: defaultLegendLabel }, legendFieldsDefaultsForLayer),
    yAxis: parseYAxisConfig(partialConfig.yAxis, atrTheme.yAxis),
    valueLabelFormatter: partialConfig.valueLabelFormatter ?? atrDefaults.valueLabelFormatter,
    onElementHover: partialConfig.onElementHover,
    onElementClick: partialConfig.onElementClick,
  };    
};

export default parse;
