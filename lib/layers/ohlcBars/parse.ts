/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { OhlcBarsLayerConfig, OhlcBarsLayerConfigComplete, ohlcBarsLayerDefaults, REQUIRED_INPUT_KEYS } from './OhlcBarsLayerConfig';
import parseDirectionalBarConfig from '../../config/elements/bar/parseDirectionalBarConfig';
import parseDirectionalValueMarkerConfig from '../../config/valueMarker/parseDirectionalValueMarkerConfig';
import parseLegendConfig from '../../config/legend/parseLegendConfig';
import createSelector from '../../utils/createSelector';
import { LegendFieldConfigDefaultsForLayer } from '../../config/legend/LegendFieldConfig';
import { LayersTheme } from '../../config/layer/LayersTheme';
import parseYAxisConfig from '../../config/layer/yAxis/parseYAxisConfig';
import validateLayerInputs from '../../config/layer/validateLayerInputs';

const parse = (partialConfig: OhlcBarsLayerConfig, layersTheme: LayersTheme, panelId: string): OhlcBarsLayerConfigComplete => {
  const ohlcBarsTheme = layersTheme.ohlcBars;
  const id = partialConfig.id ?? `${ohlcBarsLayerDefaults.id}_${panelId}`;
  const inputs = partialConfig.inputs ?? ohlcBarsLayerDefaults.inputs;

  const legendFieldsDefaultsForLayer: Record<string, LegendFieldConfigDefaultsForLayer> = {
    'open': {
      output: 'open',
      label: 'O',
      valueSelector: createSelector(`open`),
    },
    'high': {
      output: 'high',
      label: 'H',
      valueSelector: createSelector(`high`),
    },
    'low': {
      output: 'low',
      label: 'L',
      valueSelector: createSelector(`low`),
    },
    'close': {
      output: 'close',
      label: 'C',
      valueSelector: createSelector(`close`),
    },
  };

  validateLayerInputs(inputs, REQUIRED_INPUT_KEYS);

  return {
    id,
    type: 'price:ohlc-bars',
    indicator: false,
    requiredInputKeys: ['open', 'high', 'low', 'close'],
    defaultScale: ohlcBarsLayerDefaults.defaultScale,
    scale: partialConfig.scale ?? null,
    scalePolicy: 'fixed',
    series: {
      bars: parseDirectionalBarConfig(partialConfig.series?.bars, ohlcBarsTheme.series.bars),
    },
    valueToY: partialConfig.valueToY ?? ohlcBarsLayerDefaults.valueToY,
    markers: {
      value: parseDirectionalValueMarkerConfig(partialConfig.markers?.value, ohlcBarsTheme.markers.value),
    },
    legend: parseLegendConfig(partialConfig.legend, ohlcBarsTheme.legend, legendFieldsDefaultsForLayer),
    yAxis: parseYAxisConfig(partialConfig.yAxis, ohlcBarsTheme.yAxis),
    valueLabelFormatter: partialConfig.valueLabelFormatter ?? ohlcBarsLayerDefaults.valueLabelFormatter,
    inputs,
    outputs: ohlcBarsLayerDefaults.outputs,
    period: 1,
    offset: 0,
    lookback: 0,
    calculate: true,
    includeInAutoScale: true,
    onElementHover: partialConfig.onElementHover,
    onElementClick: partialConfig.onElementClick,
    onBarHover: partialConfig.onBarHover,
    onBarClick: partialConfig.onBarClick,
  };
};

export default parse;
