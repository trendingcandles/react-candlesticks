/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import parseLineConfig from '../../config/elements/line/parseLineConfig';
import { LayersTheme } from '../../config/layer/LayerConfig';
import parseLookback from '../../config/layer/parseLookback';
import { sourceFieldToInput } from '../../config/layer/inputSourceShorthand';
import parseYAxisConfig from '../../config/layer/yAxis/parseYAxisConfig';
import validateLayerInputs from '../../config/layer/validateLayerInputs';
import { LegendFieldConfigDefaultsForLayer } from '../../config/legend/LegendFieldConfig';
import parseLegendConfig from '../../config/legend/parseLegendConfig';
import parseValueMarkerConfig from '../../config/valueMarker/parseValueMarkerConfig';
import createSelector from '../../utils/createSelector';
import { AdxLayerConfig, AdxLayerConfigComplete, REQUIRED_INPUT_KEYS, adxDefaults } from './AdxLayerConfig';
import { assertPositiveNumber } from '../../config/utils/validateNumber';

const parse = (partialConfig: AdxLayerConfig, layersTheme: LayersTheme, panelId: string): AdxLayerConfigComplete => {
  const adxTheme = layersTheme.adx;
  const inputs = partialConfig.inputs ?? [
    sourceFieldToInput('high', partialConfig.source?.high ?? 'high'),
    sourceFieldToInput('low', partialConfig.source?.low ?? 'low'),
    sourceFieldToInput('close', partialConfig.source?.close ?? 'close'),
  ];
  const diLength = assertPositiveNumber(
    partialConfig.diLength ?? partialConfig.period ?? adxDefaults.diLength,
    'adx.diLength',
  );
  const smoothing = assertPositiveNumber(
    partialConfig.smoothing ?? adxDefaults.smoothing,
    'adx.smoothing',
  );
  const id = partialConfig.id ?? `${adxDefaults.id}_${panelId}_${diLength}_${smoothing}`;

  const legendFieldsDefaultsForLayer: Record<string, LegendFieldConfigDefaultsForLayer> = {
    value: {
      output: 'value',
      label: '',
      color: typeof partialConfig.series?.value === 'object' ? partialConfig.series.value.color : undefined,
      valueSelector: createSelector(`indicators.${id}.value`),
    },
  };

  validateLayerInputs(inputs, REQUIRED_INPUT_KEYS);

  return {
    id,
    type: 'adx',
    requiredInputKeys: REQUIRED_INPUT_KEYS,
    indicator: true,
    defaultScale: adxDefaults.defaultScale,
    scale: partialConfig.scale ?? null,
    scalePolicy: 'derived',
    valueGridLines: partialConfig.valueGridLines,
    diLength,
    smoothing,
    period: diLength,
    lookback: parseLookback(diLength + smoothing, partialConfig.lookback ?? adxDefaults.lookback),
    calculate: partialConfig.calculate ?? adxDefaults.calculate,
    includeInAutoScale: partialConfig.includeInAutoScale ?? adxDefaults.includeInAutoScale,
    valueToY: partialConfig.valueToY ?? adxDefaults.valueToY,
    inputs,
    outputs: partialConfig.outputs ?? adxDefaults.outputs,
    offset: 0,
    series: {
      value: parseLineConfig(partialConfig.series?.value, adxTheme.series.value),
    },
    markers: {
      value: parseValueMarkerConfig(
        partialConfig.markers?.value,
        adxTheme.markers.value,
        typeof partialConfig.series?.value === 'object' ? partialConfig.series.value.color : undefined,
      ),
    },
    legend: parseLegendConfig(
      partialConfig.legend,
      { ...adxTheme.legend, label: `ADX ${diLength} ${smoothing}` },
      legendFieldsDefaultsForLayer,
    ),
    yAxis: parseYAxisConfig(partialConfig.yAxis, adxTheme.yAxis),
    valueLabelFormatter: partialConfig.valueLabelFormatter ?? adxDefaults.valueLabelFormatter,
  };
};

export default parse;
