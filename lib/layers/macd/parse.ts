/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import parseValueMarkerConfig from '../../config/valueMarker/parseValueMarkerConfig';
import parseBarConfig from '../../config/elements/bar/parseBarConfig';
import parseLineConfig from '../../config/elements/line/parseLineConfig';
import { LegendFieldConfigDefaultsForLayer } from '../../config/legend/LegendFieldConfig';
import parseLegendConfig from '../../config/legend/parseLegendConfig';
import parseLookback from '../../config/layer/parseLookback';
import createSelector from '../../utils/createSelector';
import { MacdLayerConfig, MacdLayerConfigComplete, REQUIRED_INPUT_KEYS, macdDefaults } from './MacdLayerConfig';
import { LayersTheme } from '../../config/layer/LayersTheme';
import parseYAxisConfig from '../../config/layer/yAxis/parseYAxisConfig';
import validateLayerInputs from '../../config/layer/validateLayerInputs';
import { resolveSingleInputSource } from '../../config/layer/inputSourceShorthand';

const parse = (partialConfig: MacdLayerConfig, layersTheme: LayersTheme, panelId: string): MacdLayerConfigComplete => {
  const macdTheme = layersTheme.macd;
  const inputs = resolveSingleInputSource('input', partialConfig.inputs, partialConfig.source, macdDefaults.inputs);
  const fastPeriod = partialConfig.fastPeriod ?? partialConfig.period ?? macdDefaults.fastPeriod;
  const slowPeriod = partialConfig.slowPeriod ?? macdDefaults.slowPeriod;
  const signalPeriod = partialConfig.signalPeriod ?? macdDefaults.signalPeriod;
  const id = partialConfig.id ?? `${macdDefaults.id}_${panelId}_${fastPeriod}_${slowPeriod}_${signalPeriod}`;
  const macdLineColorExplicityDefined = typeof partialConfig.series?.macd === 'object' ? partialConfig.series.macd.color : undefined;
  const signalLineColorExplicityDefined = typeof partialConfig.series?.signal === 'object' ? partialConfig.series.signal.color : undefined;

  const defaultLegendLabel = `MACD ${fastPeriod} ${slowPeriod} ${signalPeriod}`;

  const legendFieldsDefaultsForLayer: Record<string, LegendFieldConfigDefaultsForLayer> = {
    'macd': {
      output: 'macd',
      label: '',
      color: typeof partialConfig.series?.macd === 'object' ? partialConfig.series.macd.color : undefined,
      valueSelector: createSelector(`indicators.${id}.macd`),
    },
    'signal': {
      output: 'signal',
      label: '',
      color: typeof partialConfig.series?.signal === 'object' ? partialConfig.series.signal.color : undefined,
      valueSelector: createSelector(`indicators.${id}.signal`),
    },
    'histogram': {
      output: 'histogram',
      label: '',
      valueSelector: createSelector(`indicators.${id}.histogram`),
    },
  };

  validateLayerInputs(inputs, REQUIRED_INPUT_KEYS);

  return {
    id,
    type: 'macd',
    requiredInputKeys: ['input'],
    indicator: true,
    defaultScale: macdDefaults.defaultScale,
    scale: partialConfig.scale ?? null,
    scalePolicy: 'expandable',
    fastPeriod,
    period: fastPeriod, // backward-compatible alias
    lookback: parseLookback(slowPeriod, partialConfig.lookback ?? macdDefaults.lookback),
    slowPeriod,
    signalPeriod,
    offset: 0,
    calculate: partialConfig.calculate ?? macdDefaults.calculate,
    includeInAutoScale: partialConfig.includeInAutoScale ?? macdDefaults.includeInAutoScale,
    valueToY: partialConfig.valueToY ?? macdDefaults.valueToY,
    inputs,
    outputs: partialConfig.outputs ?? macdDefaults.outputs,
    series: {
      macd: parseLineConfig(partialConfig.series?.macd, macdTheme.series.macd),
      signal: parseLineConfig(partialConfig.series?.signal, macdTheme.series.signal),
      histogramUp: parseBarConfig(partialConfig.series?.histogramUp, macdTheme.series.histogramUp),
      histogramDown: parseBarConfig(partialConfig.series?.histogramDown, macdTheme.series.histogramDown),
    },
    markers: {
      macd: parseValueMarkerConfig(partialConfig.markers?.macd ?? false, macdTheme.markers.macd, macdLineColorExplicityDefined),
      signal: parseValueMarkerConfig(partialConfig.markers?.signal ?? false, macdTheme.markers.signal, signalLineColorExplicityDefined),
    },
    legend: parseLegendConfig(partialConfig.legend, { ...macdTheme.legend, label: defaultLegendLabel }, legendFieldsDefaultsForLayer),
    yAxis: parseYAxisConfig(partialConfig.yAxis, macdTheme.yAxis),
    valueLabelFormatter: partialConfig.valueLabelFormatter ?? macdDefaults.valueLabelFormatter,
    onElementHover: partialConfig.onElementHover,
    onElementClick: partialConfig.onElementClick,
  };    
};

export default parse;
