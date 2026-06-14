/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import parseLookback from '../../config/layer/parseLookback';
import { BollingerBandsLayerConfig, BollingerBandsLayerConfigComplete, REQUIRED_INPUT_KEYS, bollingerBandsDefaults } from './BollingerBandsLayerConfig';
import parseLineConfig from '../../config/elements/line/parseLineConfig';
import parseValueMarkerConfig from '../../config/valueMarker/parseValueMarkerConfig';
import parseLegendConfig from '../../config/legend/parseLegendConfig';
import { LegendFieldConfigDefaultsForLayer } from '../../config/legend/LegendFieldConfig';
import createSelector from '../../utils/createSelector';
import { LayersTheme } from '../../config/layer/LayersTheme';
import parseYAxisConfig from '../../config/layer/yAxis/parseYAxisConfig';
import validateLayerInputs from '../../config/layer/validateLayerInputs';
import { resolveSingleInputSource } from '../../config/layer/inputSourceShorthand';

const parse = (partialConfig: BollingerBandsLayerConfig, layersTheme: LayersTheme, panelId: string): BollingerBandsLayerConfigComplete => {
  const bollingerBandsTheme = layersTheme.bollingerBands;
  const inputs = resolveSingleInputSource('input', partialConfig.inputs, partialConfig.source, bollingerBandsDefaults.inputs);
  const period = partialConfig.period ?? bollingerBandsDefaults.period;
  const id = partialConfig.id ?? `${bollingerBandsDefaults.id}_${panelId}_${period}`;
  const standardDeviations = partialConfig.standardDeviations ?? bollingerBandsDefaults.standardDeviations;
  const valueLineColorExplicityDefined = typeof partialConfig.series?.middle === 'object' ? partialConfig.series.middle.color : undefined;
  const defaultBandFillColor = bollingerBandsTheme.bands.channel.fillColor
    ?? bollingerBandsDefaults.bands.channel?.fillColor
    ?? 'rgba(0, 100, 200, 0.1)';

  const defaultLegendLabel = `BB ${period} ${standardDeviations}`;

  const legendFieldsDefaultsForLayer: Record<string, LegendFieldConfigDefaultsForLayer> = {
    'upper': {
      output: 'upper',
      label: '',
      color: typeof partialConfig.series?.upper === 'object' ? partialConfig.series.upper.color : undefined,
      valueSelector: createSelector(`indicators.${id}.upper`),
    },
    'middle': {
      output: 'middle',
      label: '',
      color: typeof partialConfig.series?.middle === 'object' ? partialConfig.series.middle.color : undefined,
      valueSelector: createSelector(`indicators.${id}.middle`),
    },
    'lower': {
      output: 'lower',
      label: '',
      color: typeof partialConfig.series?.lower === 'object' ? partialConfig.series.lower.color : undefined,
      valueSelector: createSelector(`indicators.${id}.lower`),
    },
  };

  validateLayerInputs(inputs, REQUIRED_INPUT_KEYS);

  return {
    id,
    type: 'bollinger-bands',
    requiredInputKeys: ['input'],
    indicator: true,
    defaultScale: bollingerBandsDefaults.defaultScale,
    scale: partialConfig.scale ?? null,
    scalePolicy: 'derived',
    period,
    lookback: parseLookback(period, partialConfig.lookback ?? bollingerBandsDefaults.lookback),
    calculate: partialConfig.calculate ?? bollingerBandsDefaults.calculate,
    includeInAutoScale: partialConfig.includeInAutoScale ?? bollingerBandsDefaults.includeInAutoScale,
    valueToY: partialConfig.valueToY ?? bollingerBandsDefaults.valueToY,
    inputs,
    outputs: partialConfig.outputs ?? bollingerBandsDefaults.outputs,
    standardDeviations,
    offset: partialConfig.offset ?? bollingerBandsDefaults.offset,
    series: {
      middle: parseLineConfig(partialConfig.series?.middle, bollingerBandsTheme.series.middle ?? bollingerBandsDefaults.series.middle),
      upper: parseLineConfig(partialConfig.series?.upper, bollingerBandsTheme.series.upper ?? bollingerBandsDefaults.series.upper),
      lower: parseLineConfig(partialConfig.series?.lower, bollingerBandsTheme.series.lower ?? bollingerBandsDefaults.series.lower),
    },
    bands: {
      channel: partialConfig.bands?.channel === false
        ? null
        : {
            fillColor: partialConfig.bands?.channel?.fillColor ?? defaultBandFillColor,
          },
    },
    markers: {
      value: parseValueMarkerConfig(partialConfig.markers?.value, bollingerBandsTheme.markers.value, valueLineColorExplicityDefined),
    },
    legend: parseLegendConfig(partialConfig.legend, { ...bollingerBandsTheme.legend, label: defaultLegendLabel }, legendFieldsDefaultsForLayer),
    yAxis: parseYAxisConfig(partialConfig.yAxis, bollingerBandsTheme.yAxis),
    valueLabelFormatter: partialConfig.valueLabelFormatter ?? bollingerBandsDefaults.valueLabelFormatter,
  };    
};

export default parse;
