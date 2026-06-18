import parseLineConfig from '../../config/elements/line/parseLineConfig';
import { LegendFieldConfigDefaultsForLayer } from '../../config/legend/LegendFieldConfig';
import parseLegendConfig from '../../config/legend/parseLegendConfig';
import { LayersTheme } from '../../config/layer/LayersTheme';
import parseLookback from '../../config/layer/parseLookback';
import { sourceFieldToInput } from '../../config/layer/inputSourceShorthand';
import validateLayerInputs from '../../config/layer/validateLayerInputs';
import parseYAxisConfig from '../../config/layer/yAxis/parseYAxisConfig';
import parseValueMarkerConfig from '../../config/valueMarker/parseValueMarkerConfig';
import { assertPositiveNumber } from '../../config/utils/validateNumber';
import createSelector from '../../utils/createSelector';
import { REQUIRED_INPUT_KEYS, WilliamsRLayerConfig, WilliamsRLayerConfigComplete, williamsRDefaults } from './WilliamsRLayerConfig';

const parse = (partialConfig: WilliamsRLayerConfig, layersTheme: LayersTheme, panelId: string): WilliamsRLayerConfigComplete => {
  const theme = layersTheme.williamsR;
  const length = partialConfig.length ?? partialConfig.period ?? williamsRDefaults.length;
  assertPositiveNumber(length, 'williams-r.length');
  const inputs = partialConfig.inputs ?? [
    sourceFieldToInput('high', partialConfig.source?.high ?? 'high'),
    sourceFieldToInput('low', partialConfig.source?.low ?? 'low'),
    sourceFieldToInput('close', partialConfig.source?.close ?? 'close'),
  ];
  validateLayerInputs(inputs, REQUIRED_INPUT_KEYS);
  const id = partialConfig.id ?? `${williamsRDefaults.id}_${panelId}_${length}`;
  const color = typeof partialConfig.series?.value === 'object' ? partialConfig.series.value.color : undefined;
  const fields: Record<string, LegendFieldConfigDefaultsForLayer> = {
    value: { output: 'value', label: '', color, valueSelector: createSelector(`indicators.${id}.value`) },
  };

  return {
    id,
    type: 'williams-r',
    requiredInputKeys: REQUIRED_INPUT_KEYS,
    indicator: true,
    defaultScale: williamsRDefaults.defaultScale,
    scale: partialConfig.scale ?? null,
    scalePolicy: 'expandable',
    valueGridLines: partialConfig.valueGridLines ?? [-80, -20],
    length,
    period: length,
    offset: 0,
    lookback: parseLookback(length, partialConfig.lookback ?? williamsRDefaults.lookback),
    calculate: partialConfig.calculate ?? williamsRDefaults.calculate,
    includeInAutoScale: partialConfig.includeInAutoScale ?? williamsRDefaults.includeInAutoScale,
    valueToY: partialConfig.valueToY ?? williamsRDefaults.valueToY,
    inputs,
    outputs: partialConfig.outputs ?? williamsRDefaults.outputs,
    series: { value: parseLineConfig(partialConfig.series?.value, theme.series.value) },
    markers: { value: parseValueMarkerConfig(partialConfig.markers?.value, theme.markers.value, color) },
    legend: parseLegendConfig(partialConfig.legend, { ...theme.legend, label: `Williams %R ${length}` }, fields),
    yAxis: parseYAxisConfig(partialConfig.yAxis, theme.yAxis),
    valueLabelFormatter: partialConfig.valueLabelFormatter ?? williamsRDefaults.valueLabelFormatter,
    onElementHover: partialConfig.onElementHover,
    onElementClick: partialConfig.onElementClick,
  };
};

export default parse;
