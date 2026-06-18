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
import { ObvLayerConfig, ObvLayerConfigComplete, REQUIRED_INPUT_KEYS, obvDefaults } from './ObvLayerConfig';

const parse = (partialConfig: ObvLayerConfig, layersTheme: LayersTheme, panelId: string): ObvLayerConfigComplete => {
  const theme = layersTheme.obv;
  const smoothingLength = partialConfig.smoothingLength ?? obvDefaults.smoothingLength;
  assertPositiveNumber(smoothingLength, 'obv.smoothingLength');
  const inputs = partialConfig.inputs ?? [
    sourceFieldToInput('price', partialConfig.source ?? 'close'),
    sourceFieldToInput('volume', 'volume'),
  ];
  validateLayerInputs(inputs, REQUIRED_INPUT_KEYS);
  const id = partialConfig.id ?? `${obvDefaults.id}_${panelId}_${smoothingLength}`;
  const valueColor = typeof partialConfig.series?.value === 'object' ? partialConfig.series.value.color : undefined;
  const smoothingColor = typeof partialConfig.series?.smoothing === 'object' ? partialConfig.series.smoothing.color : undefined;
  const fields: Record<string, LegendFieldConfigDefaultsForLayer> = {
    value: { output: 'value', label: 'OBV', color: valueColor, valueSelector: createSelector(`indicators.${id}.value`) },
    smoothing: { output: 'smoothing', label: 'SMA', color: smoothingColor, valueSelector: createSelector(`indicators.${id}.smoothing`) },
  };

  return {
    id,
    type: 'obv',
    requiredInputKeys: REQUIRED_INPUT_KEYS,
    indicator: true,
    defaultScale: obvDefaults.defaultScale,
    scale: partialConfig.scale ?? null,
    scalePolicy: 'derived',
    smoothingLength,
    period: smoothingLength,
    offset: 0,
    lookback: parseLookback(smoothingLength, partialConfig.lookback ?? obvDefaults.lookback),
    calculate: partialConfig.calculate ?? obvDefaults.calculate,
    includeInAutoScale: partialConfig.includeInAutoScale ?? obvDefaults.includeInAutoScale,
    valueToY: partialConfig.valueToY ?? obvDefaults.valueToY,
    inputs,
    outputs: partialConfig.outputs ?? obvDefaults.outputs,
    series: {
      value: parseLineConfig(partialConfig.series?.value, theme.series.value),
      smoothing: parseLineConfig(partialConfig.series?.smoothing, theme.series.smoothing),
    },
    markers: {
      value: parseValueMarkerConfig(partialConfig.markers?.value, theme.markers.value, valueColor),
      smoothing: parseValueMarkerConfig(partialConfig.markers?.smoothing, theme.markers.smoothing, smoothingColor),
    },
    legend: parseLegendConfig(partialConfig.legend, { ...theme.legend, label: `OBV SMA ${smoothingLength}` }, fields),
    yAxis: parseYAxisConfig(partialConfig.yAxis, theme.yAxis),
    valueLabelFormatter: partialConfig.valueLabelFormatter ?? obvDefaults.valueLabelFormatter,
    onElementHover: partialConfig.onElementHover,
    onElementClick: partialConfig.onElementClick,
  };
};

export default parse;
