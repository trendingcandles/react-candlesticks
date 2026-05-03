/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { CandlestickLayerConfig, CandlestickLayerConfigComplete, candlestickLayerDefaults, REQUIRED_INPUT_KEYS } from './CandlestickLayerConfig';
import parseDirectionalBarConfig from '../../config/elements/bar/parseDirectionalBarConfig';
import parseDirectionalLineConfig from '../../config/elements/line/parseDirectionalLineConfig';
import parseDirectionalValueMarkerConfig from '../../config/valueMarker/parseDirectionalValueMarkerConfig';
import parseLegendConfig from '../../config/legend/parseLegendConfig';
import createSelector from '../../utils/createSelector';
import { LegendFieldConfigDefaultsForLayer } from '../../config/legend/LegendFieldConfig';
import { LayersTheme } from '../../config/layer/LayerConfig';
import parseYAxisConfig from '../../config/layer/yAxis/parseYAxisConfig';
import validateLayerInputs from '../../config/layer/validateLayerInputs';

const parseCandlestickLayerConfig = (partialConfig: CandlestickLayerConfig, layersTheme: LayersTheme, panelId: string): CandlestickLayerConfigComplete => {
  const candlesticksTheme = layersTheme.candlesticks;
  const id = partialConfig.id ?? `${candlestickLayerDefaults.id}_${panelId}`;
  const inputs = partialConfig.inputs ?? candlestickLayerDefaults.inputs;

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
    type: 'price:candlesticks',
    indicator: false,
    requiredInputKeys: ['open', 'high', 'low', 'close'],
    defaultScale: candlestickLayerDefaults.defaultScale,
    scale: partialConfig.scale ?? null,
    scalePolicy: 'fixed',
    series: {
      body: parseDirectionalBarConfig(partialConfig.series?.body, candlesticksTheme.series.body),
      wick: parseDirectionalLineConfig(partialConfig.series?.wick, candlesticksTheme.series.wick),
    },
    valueToY: partialConfig.valueToY ?? candlestickLayerDefaults.valueToY,
    markers: {
      value: parseDirectionalValueMarkerConfig(partialConfig.markers?.value, candlesticksTheme.markers.value),
    },
    legend: parseLegendConfig(partialConfig.legend, candlesticksTheme.legend, legendFieldsDefaultsForLayer),
    yAxis: parseYAxisConfig(partialConfig.yAxis, candlesticksTheme.yAxis),
    valueLabelFormatter: partialConfig.valueLabelFormatter ?? candlestickLayerDefaults.valueLabelFormatter,
    inputs,
    outputs: candlestickLayerDefaults.outputs,
    period: 1,
    offset: 0,
    lookback: 0,
    calculate: true,
    includeInAutoScale: true,
  };
};

export default parseCandlestickLayerConfig;
