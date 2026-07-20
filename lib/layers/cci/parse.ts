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
import { CciLayerConfig, CciLayerConfigComplete, REQUIRED_INPUT_KEYS, cciDefaults, getCciLookback } from './CciLayerConfig';

const parse = (partialConfig: CciLayerConfig, layersTheme: LayersTheme, panelId: string): CciLayerConfigComplete => {
  const theme = layersTheme.cci;
  const length = partialConfig.length ?? partialConfig.period ?? cciDefaults.length;
  const smoothingLength = partialConfig.smoothingLength ?? cciDefaults.smoothingLength;
  assertPositiveNumber(length, 'cci.length');
  assertPositiveNumber(smoothingLength, 'cci.smoothingLength');
  const inputs = partialConfig.inputs ?? [
    sourceFieldToInput('high', partialConfig.source?.high ?? 'high'),
    sourceFieldToInput('low', partialConfig.source?.low ?? 'low'),
    sourceFieldToInput('close', partialConfig.source?.close ?? 'close'),
  ];
  validateLayerInputs(inputs, REQUIRED_INPUT_KEYS);
  const id = partialConfig.id ?? `${cciDefaults.id}_${panelId}_${length}_${smoothingLength}`;
  const valueColor = typeof partialConfig.series?.value === 'object' ? partialConfig.series.value.color : undefined;
  const smoothingColor = typeof partialConfig.series?.smoothing === 'object' ? partialConfig.series.smoothing.color : undefined;
  const fields: Record<string, LegendFieldConfigDefaultsForLayer> = {
    value: { output: 'value', label: 'CCI', color: valueColor, valueSelector: createSelector(`indicators.${id}.value`) },
    smoothing: { output: 'smoothing', label: 'SMA', color: smoothingColor, valueSelector: createSelector(`indicators.${id}.smoothing`) },
  };

  return {
    id,
    type: 'cci',
    requiredInputKeys: REQUIRED_INPUT_KEYS,
    indicator: true,
    defaultScale: cciDefaults.defaultScale,
    scale: partialConfig.scale ?? null,
    scalePolicy: 'expandable',
    valueGridLines: partialConfig.valueGridLines ?? [-100, 100],
    length,
    smoothingLength,
    period: length,
    offset: 0,
    lookback: partialConfig.lookback === undefined
      ? getCciLookback(length, smoothingLength)
      : parseLookback(length, partialConfig.lookback),
    calculate: partialConfig.calculate ?? cciDefaults.calculate,
    includeInAutoScale: partialConfig.includeInAutoScale ?? cciDefaults.includeInAutoScale,
    valueToY: partialConfig.valueToY ?? cciDefaults.valueToY,
    inputs,
    outputs: partialConfig.outputs ?? cciDefaults.outputs,
    series: {
      value: parseLineConfig(partialConfig.series?.value, theme.series.value),
      smoothing: parseLineConfig(partialConfig.series?.smoothing, theme.series.smoothing),
    },
    markers: {
      value: parseValueMarkerConfig(partialConfig.markers?.value ?? false, theme.markers.value, valueColor),
      smoothing: parseValueMarkerConfig(partialConfig.markers?.smoothing ?? false, theme.markers.smoothing, smoothingColor),
    },
    legend: parseLegendConfig(partialConfig.legend, { ...theme.legend, label: `CCI ${length} SMA ${smoothingLength}` }, fields),
    yAxis: parseYAxisConfig(partialConfig.yAxis, theme.yAxis),
    valueLabelFormatter: partialConfig.valueLabelFormatter ?? cciDefaults.valueLabelFormatter,
    onElementHover: partialConfig.onElementHover,
    onElementClick: partialConfig.onElementClick,
  };
};

export default parse;
