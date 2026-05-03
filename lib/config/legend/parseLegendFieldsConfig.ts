/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LegendFieldConfig, LegendFieldConfigComplete, LegendFieldConfigDefaultsForLayer, LegendFieldTheme } from './LegendFieldConfig';
import parseLegendFieldConfig from './parseLegendFieldConfig';

const parseLegendFieldConfigs = (
  partialConfigs: LegendFieldConfig[] = [],
  legendFieldThemes: LegendFieldTheme[] = [],
  fieldsDefaultsForLayer: Record<string, LegendFieldConfigDefaultsForLayer>,
): LegendFieldConfigComplete[] => {

  const legendFieldThemeByOutputKey: Record<string, LegendFieldTheme> = {};
  for (const fieldConfig of legendFieldThemes) {
    legendFieldThemeByOutputKey[fieldConfig.output] = fieldConfig;
  }
  const fieldsDefaultsForLayerKeys = Object.keys(fieldsDefaultsForLayer);
  const unknownOutputs = partialConfigs
    .map(config => config.output)
    .filter(outputKey => !fieldsDefaultsForLayerKeys.includes(outputKey));

  if (unknownOutputs.length > 0) {
    throw new Error(
      `Invalid legend field output(s): ${[...new Set(unknownOutputs)].join(', ')}. ` +
      `Allowed outputs: ${fieldsDefaultsForLayerKeys.join(', ')}`
    );
  }

  return fieldsDefaultsForLayerKeys.map(outputKey => {
    const partialConfig: LegendFieldConfig = partialConfigs.find(c => c.output === outputKey) ?? { output: outputKey };
    return parseLegendFieldConfig(
      partialConfig,
      legendFieldThemeByOutputKey[outputKey],
      fieldsDefaultsForLayer[outputKey],
    )
});

};

export default parseLegendFieldConfigs;
