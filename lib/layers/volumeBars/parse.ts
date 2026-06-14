/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import createSelector from '../../utils/createSelector';
import parseValueMarkerConfig from '../../config/valueMarker/parseValueMarkerConfig';
import parseDirectionalBarConfig from '../../config/elements/bar/parseDirectionalBarConfig';
import { LegendFieldConfigDefaultsForLayer } from '../../config/legend/LegendFieldConfig';
import parseLegendConfig from '../../config/legend/parseLegendConfig';
import { REQUIRED_INPUT_KEYS, VolumeBarsLayerConfig, VolumeBarsLayerConfigComplete, volumeBarsDefaults } from './VolumeBarsLayerConfig';
import { LayersTheme } from '../../config/layer/LayersTheme';
import parseYAxisConfig from '../../config/layer/yAxis/parseYAxisConfig';
import validateLayerInputs from '../../config/layer/validateLayerInputs';

const parse = (partialConfig: VolumeBarsLayerConfig, layersTheme: LayersTheme, panelId: string): VolumeBarsLayerConfigComplete => {
  const volumeBarsTheme = layersTheme.volumeBars;
  const id = partialConfig.id ?? `${volumeBarsDefaults.id}_${panelId}`;
  const inputs = partialConfig.inputs ?? volumeBarsDefaults.inputs;

  const defaultLegendLabel = 'Volume';

  const legendFieldsDefaultsForLayer: Record<string, LegendFieldConfigDefaultsForLayer> = {
    'volume': {
      output: 'volume',
      label: '',
      valueSelector: createSelector(`volume`),
    },
  };

  validateLayerInputs(inputs, REQUIRED_INPUT_KEYS);

  return {
    id,
    type: 'volume:bars',
    indicator: false,
    requiredInputKeys: ['volume'],
    defaultScale: volumeBarsDefaults.defaultScale,
    scale: partialConfig.scale ?? null,
    scalePolicy: 'fixed',
    series: {
      bars: parseDirectionalBarConfig(partialConfig.series?.bars, volumeBarsTheme.series.bars),
    },
    valueToY: partialConfig.valueToY ?? volumeBarsDefaults.valueToY,
    markers: {
      value: parseValueMarkerConfig(partialConfig.markers?.value, volumeBarsTheme.markers.value),
    },
    legend: parseLegendConfig(partialConfig.legend, { ...volumeBarsTheme.legend, label: defaultLegendLabel }, legendFieldsDefaultsForLayer),
    yAxis: parseYAxisConfig(partialConfig.yAxis, volumeBarsTheme.yAxis),
    valueLabelFormatter: partialConfig.valueLabelFormatter ?? volumeBarsDefaults.valueLabelFormatter,
    inputs,
    outputs: volumeBarsDefaults.outputs,
    period: 1,
    offset: 0,
    lookback: 0,
    calculate: true,
    includeInAutoScale: true,
  };
};

export default parse;
