/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LegendFieldConfig, LegendFieldConfigComplete, LegendFieldConfigDefaultsForLayer, legendFieldDefaults, LegendFieldTheme } from './LegendFieldConfig';

const parseLegendFieldConfig = (
  partialConfig: LegendFieldConfig,
  legendFieldTheme: LegendFieldTheme,
  fieldsDefaultsForLayer: LegendFieldConfigDefaultsForLayer,
): LegendFieldConfigComplete => {

  const legendConfigComplete: LegendFieldConfigComplete = {
    output: partialConfig.output,
    valueSelector: fieldsDefaultsForLayer.valueSelector,
    color: partialConfig.color ?? fieldsDefaultsForLayer.color ?? legendFieldTheme.color ?? legendFieldDefaults.color,
    label: partialConfig.label ?? legendFieldTheme.label ?? fieldsDefaultsForLayer.label,
  };

  return legendConfigComplete;
};

export default parseLegendFieldConfig;
