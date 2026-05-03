/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import parseLookback from '../../config/layer/parseLookback';
import { EmaLayerConfigComplete, EmaLayerConfig, emaDefaults, REQUIRED_INPUT_KEYS } from './EmaLayerConfig';
import parseValueMarkerConfig from '../../config/valueMarker/parseValueMarkerConfig';
import parseLineConfig from '../../config/elements/line/parseLineConfig';
import parseLegendConfig from '../../config/legend/parseLegendConfig';
import { LegendFieldConfigDefaultsForLayer } from '../../config/legend/LegendFieldConfig';
import createSelector from '../../utils/createSelector';
import { LayersTheme } from '../../config/layer/LayerConfig';
import parseYAxisConfig from '../../config/layer/yAxis/parseYAxisConfig';
import validateLayerInputs from '../../config/layer/validateLayerInputs';
import { resolveSingleInputSource } from '../../config/layer/inputSourceShorthand';

const parse = (partialConfig: EmaLayerConfig, layersTheme: LayersTheme, panelId: string): EmaLayerConfigComplete => {
  const emaTheme = layersTheme.ema;
  const inputs = resolveSingleInputSource('input', partialConfig.inputs, partialConfig.source, emaDefaults.inputs);
  const period = partialConfig.period ?? emaDefaults.period;
  const id = partialConfig.id ?? `${emaDefaults.id}_${panelId}_${period}`;

  const valueLineColorExplicityDefined = typeof partialConfig.series?.value === 'object' ? partialConfig.series.value.color : undefined;

  const defaultLegendLabel = `EMA ${period}`;

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
    type: 'ema',
    requiredInputKeys: ['input'],
    indicator: true,
    defaultScale: emaDefaults.defaultScale,
    scale: partialConfig.scale ?? null,
    scalePolicy: 'derived',
    period,
    lookback: parseLookback(period, partialConfig.lookback),
    calculate: partialConfig.calculate ?? emaDefaults.calculate,
    includeInAutoScale: partialConfig.includeInAutoScale ?? emaDefaults.includeInAutoScale,
    valueToY: partialConfig.valueToY ?? emaDefaults.valueToY,
    inputs,
    outputs: partialConfig.outputs ?? emaDefaults.outputs,
    offset: partialConfig.offset ?? emaDefaults.offset,
    series: {
      value: parseLineConfig(partialConfig.series?.value, emaTheme.series.value ?? emaDefaults.series.value),
    },
    markers: {
      value: parseValueMarkerConfig(partialConfig.markers?.value, emaTheme.markers.value, valueLineColorExplicityDefined),
    },
    legend: parseLegendConfig(partialConfig.legend, { ...emaTheme.legend, label: defaultLegendLabel }, legendFieldsDefaultsForLayer),
    yAxis: parseYAxisConfig(partialConfig.yAxis, emaTheme.yAxis),
    valueLabelFormatter: partialConfig.valueLabelFormatter ?? emaDefaults.valueLabelFormatter,
  };    
};

export default parse;
