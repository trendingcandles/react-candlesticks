/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import parseLookback from '../../config/layer/parseLookback';
import { REQUIRED_INPUT_KEYS, SmaLayerConfig, SmaLayerConfigComplete, smaDefaults } from './SmaLayerConfig';
import parseValueMarkerConfig from '../../config/valueMarker/parseValueMarkerConfig';
import parseLineConfig from '../../config/elements/line/parseLineConfig';
import parseLegendConfig from '../../config/legend/parseLegendConfig';
import { LegendFieldConfigDefaultsForLayer } from '../../config/legend/LegendFieldConfig';
import createSelector from '../../utils/createSelector';
import { LayersTheme } from '../../config/layer/LayersTheme';
import parseYAxisConfig from '../../config/layer/yAxis/parseYAxisConfig';
import validateLayerInputs from '../../config/layer/validateLayerInputs';
import { resolveSingleInputSource } from '../../config/layer/inputSourceShorthand';

const parse = (partialConfig: SmaLayerConfig, layersTheme: LayersTheme, panelId: string): SmaLayerConfigComplete => {
  const smaTheme = layersTheme.sma;
  const inputs = resolveSingleInputSource('input', partialConfig.inputs, partialConfig.source, smaDefaults.inputs);
  const period = partialConfig.period ?? smaDefaults.period;
  const id = partialConfig.id ?? `${smaDefaults.id}_${panelId}_${period}`;
  const valueLineColorExplicityDefined = typeof partialConfig.series?.value === 'object' ? partialConfig.series.value.color : undefined;

  const defaultLegendLabel = `SMA ${period}`;

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
    type: 'sma',
    requiredInputKeys: ['input'],
    indicator: true,
    defaultScale: smaDefaults.defaultScale,
    scale: partialConfig.scale ?? null,
    scalePolicy: 'derived',
    period,
    lookback: parseLookback(period, partialConfig.lookback),
    calculate: partialConfig.calculate ?? smaDefaults.calculate,
    includeInAutoScale: partialConfig.includeInAutoScale ?? smaDefaults.includeInAutoScale,
    valueToY: partialConfig.valueToY ?? smaDefaults.valueToY,
    inputs,
    outputs: partialConfig.outputs ?? smaDefaults.outputs,
    offset: partialConfig.offset ?? smaDefaults.offset,
    series: {
      value: parseLineConfig(partialConfig.series?.value, smaTheme.series.value ?? smaDefaults.series.value),
    },
    markers: {
      value: parseValueMarkerConfig(partialConfig.markers?.value, smaTheme.markers.value, valueLineColorExplicityDefined),
    },
    legend: parseLegendConfig(partialConfig.legend, { ...smaTheme.legend, label: defaultLegendLabel }, legendFieldsDefaultsForLayer),
    yAxis: parseYAxisConfig(partialConfig.yAxis, smaTheme.yAxis),
    valueLabelFormatter: partialConfig.valueLabelFormatter ?? smaDefaults.valueLabelFormatter,
  };    
};

export default parse;
