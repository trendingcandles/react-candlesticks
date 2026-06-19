/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import parseLookback from '../../config/layer/parseLookback';
import { StochasticLayerConfigComplete, StochasticLayerConfig, stochasticDefaults, REQUIRED_INPUT_KEYS, getStochasticLookback } from './StochasticLayerConfig';
import parseValueMarkerConfig from '../../config/valueMarker/parseValueMarkerConfig';
import parseLineConfig from '../../config/elements/line/parseLineConfig';
import parseLegendConfig from '../../config/legend/parseLegendConfig';
import { LegendFieldConfigDefaultsForLayer } from '../../config/legend/LegendFieldConfig';
import createSelector from '../../utils/createSelector';
import { LayersTheme } from '../../config/layer/LayersTheme';
import parseYAxisConfig from '../../config/layer/yAxis/parseYAxisConfig';
import validateLayerInputs from '../../config/layer/validateLayerInputs';
import { sourceFieldToInput } from '../../config/layer/inputSourceShorthand';

const parse = (partialConfig: StochasticLayerConfig, layersTheme: LayersTheme, panelId: string): StochasticLayerConfigComplete => {
  const stochasticTheme = layersTheme.stochastic;
  const highSource = partialConfig.source?.high;
  const lowSource = partialConfig.source?.low;
  const closeSource = partialConfig.source?.close;
  const inputs = partialConfig.inputs ?? [
    sourceFieldToInput('high', highSource ?? 'high'),
    sourceFieldToInput('low', lowSource ?? 'low'),
    sourceFieldToInput('close', closeSource ?? 'close'),
  ];
  const kPeriod = partialConfig.kPeriod ?? partialConfig.period ?? stochasticDefaults.kPeriod;
  const kSmoothing = partialConfig.kSmoothing ?? stochasticDefaults.kSmoothing;
  const dPeriod = partialConfig.dPeriod ?? stochasticDefaults.dPeriod;
  const id = partialConfig.id ?? `${stochasticDefaults.id}_${panelId}_${kPeriod}_${kSmoothing}_${dPeriod}`;
  const kLineColorExplicityDefined = typeof partialConfig.series?.k === 'object' ? partialConfig.series.k.color : undefined;
  const dLineColorExplicityDefined = typeof partialConfig.series?.d === 'object' ? partialConfig.series.d.color : undefined;

  const defautLegendLabel = `Stochastic ${kPeriod} ${kSmoothing} ${dPeriod}`;

  const legendFieldsDefaultsForLayer: Record<string, LegendFieldConfigDefaultsForLayer> = {
    'k': {
      output: 'k',
      label: '',
      color: typeof partialConfig.series?.k === 'object' ? partialConfig.series.k.color : undefined,
      valueSelector: createSelector(`indicators.${id}.smoothedK`),
    },
    'd': {
      output: 'd',
      label: '',
      color: typeof partialConfig.series?.d === 'object' ? partialConfig.series.d.color : undefined,
      valueSelector: createSelector(`indicators.${id}.dValue`),
    },
  };

  validateLayerInputs(inputs, REQUIRED_INPUT_KEYS);

  return {
    id,
    type: 'stochastic',
    requiredInputKeys: ['high', 'low', 'close'],
    indicator: true,
    defaultScale: stochasticDefaults.defaultScale,
    scale: partialConfig.scale ?? null,
    scalePolicy: 'expandable',
    valueGridLines: [20, 80],
    kPeriod,
    period: kPeriod, // backward-compatible alias
    lookback: partialConfig.lookback === undefined
      ? getStochasticLookback(kPeriod, kSmoothing, dPeriod)
      : parseLookback(kPeriod, partialConfig.lookback),
    calculate: partialConfig.calculate ?? stochasticDefaults.calculate,
    includeInAutoScale: partialConfig.includeInAutoScale ?? stochasticDefaults.includeInAutoScale,
    valueToY: partialConfig.valueToY ?? stochasticDefaults.valueToY,
    inputs,
    outputs: partialConfig.outputs ?? stochasticDefaults.outputs,
    kSmoothing,
    dPeriod,
    offset: 0,
    series: {
      k: parseLineConfig(partialConfig.series?.k, stochasticTheme.series.k),
      d: parseLineConfig(partialConfig.series?.d, stochasticTheme.series.d),
    },
    markers: {
      k: parseValueMarkerConfig(partialConfig.markers?.k, stochasticTheme.markers.k, kLineColorExplicityDefined),
      d: parseValueMarkerConfig(partialConfig.markers?.d, stochasticTheme.markers.d, dLineColorExplicityDefined),
    },
    legend: parseLegendConfig(partialConfig.legend, { ...stochasticTheme.legend, label: defautLegendLabel }, legendFieldsDefaultsForLayer),
    yAxis: parseYAxisConfig(partialConfig.yAxis, stochasticTheme.yAxis),
    valueLabelFormatter: partialConfig.valueLabelFormatter ?? stochasticDefaults.valueLabelFormatter,
    onElementHover: partialConfig.onElementHover,
    onElementClick: partialConfig.onElementClick,
  };

};

export default parse;
