/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import parseLineConfig from '../../config/elements/line/parseLineConfig';
import { LayersTheme } from '../../config/layer/LayersTheme';
import parseLookback from '../../config/layer/parseLookback';
import { sourceFieldToInput } from '../../config/layer/inputSourceShorthand';
import validateLayerInputs from '../../config/layer/validateLayerInputs';
import parseYAxisConfig from '../../config/layer/yAxis/parseYAxisConfig';
import parseLegendConfig from '../../config/legend/parseLegendConfig';
import { LegendFieldConfigDefaultsForLayer } from '../../config/legend/LegendFieldConfig';
import createSelector from '../../utils/createSelector';
import { assertNonNegativeNumber, assertPositiveNumber } from '../../config/utils/validateNumber';
import { ParabolicSarLayerConfig, ParabolicSarLayerConfigComplete, REQUIRED_INPUT_KEYS, parabolicSarDefaults } from './ParabolicSarLayerConfig';

const parse = (partialConfig: ParabolicSarLayerConfig, layersTheme: LayersTheme, panelId: string): ParabolicSarLayerConfigComplete => {
  const theme = layersTheme.parabolicSar;
  const start = partialConfig.start ?? parabolicSarDefaults.start;
  const increment = partialConfig.increment ?? parabolicSarDefaults.increment;
  const maxValue = partialConfig.maxValue ?? parabolicSarDefaults.maxValue;
  assertNonNegativeNumber(start, 'parabolic-sar.start');
  assertPositiveNumber(increment, 'parabolic-sar.increment');
  assertPositiveNumber(maxValue, 'parabolic-sar.maxValue');
  if (start > maxValue) throw new Error('parabolic-sar.start must be <= parabolic-sar.maxValue');

  const inputs = partialConfig.inputs ?? [
    sourceFieldToInput('high', partialConfig.source?.high ?? 'high'),
    sourceFieldToInput('low', partialConfig.source?.low ?? 'low'),
  ];
  validateLayerInputs(inputs, REQUIRED_INPUT_KEYS);
  const id = partialConfig.id ?? `${parabolicSarDefaults.id}_${panelId}_${start}_${increment}_${maxValue}`;
  const fields: Record<string, LegendFieldConfigDefaultsForLayer> = {
    value: {
      output: 'value',
      label: '',
      color: typeof partialConfig.series?.value === 'object' ? partialConfig.series.value.color : undefined,
      valueSelector: createSelector(`indicators.${id}.value`),
    },
  };

  return {
    id,
    type: 'parabolic-sar',
    requiredInputKeys: REQUIRED_INPUT_KEYS,
    indicator: true,
    defaultScale: parabolicSarDefaults.defaultScale,
    scale: partialConfig.scale ?? null,
    scalePolicy: 'derived',
    period: 1,
    start,
    increment,
    maxValue,
    offset: 0,
    lookback: parseLookback(1, partialConfig.lookback ?? parabolicSarDefaults.lookback),
    calculate: partialConfig.calculate ?? parabolicSarDefaults.calculate,
    includeInAutoScale: partialConfig.includeInAutoScale ?? parabolicSarDefaults.includeInAutoScale,
    valueToY: partialConfig.valueToY ?? parabolicSarDefaults.valueToY,
    inputs,
    outputs: partialConfig.outputs ?? parabolicSarDefaults.outputs,
    series: {
      value: parseLineConfig(partialConfig.series?.value, theme.series.value),
    },
    legend: parseLegendConfig(partialConfig.legend, { ...theme.legend, label: `Parabolic SAR ${start} ${increment} ${maxValue}` }, fields),
    yAxis: parseYAxisConfig(partialConfig.yAxis, theme.yAxis),
    valueLabelFormatter: partialConfig.valueLabelFormatter ?? parabolicSarDefaults.valueLabelFormatter,
  };
};

export default parse;
