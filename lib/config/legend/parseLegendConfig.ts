/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import parseLabelConfig from '../elements/label/parseLabelConfig';
import { LegendConfigComplete, LegendConfig, legendDefaults, LegendTheme } from './LegendConfig';
import { LegendFieldConfigDefaultsForLayer } from './LegendFieldConfig';
import parseLegendFieldConfigs from './parseLegendFieldsConfig';

const parseLegendConfig = (
  partialConfig: false | LegendConfig = {},
  legendTheme: LegendTheme,
  fieldsDefaultsForLayer: Record<string, LegendFieldConfigDefaultsForLayer>,
): null | LegendConfigComplete => {
  if (partialConfig === false) {
    return null;
  }

  const labelConfigComplete = parseLabelConfig(partialConfig, legendTheme);

  const legendConfigComplete: LegendConfigComplete = {
    ...legendDefaults,
    ...legendTheme,
    ...labelConfigComplete,
    backgroundColor: partialConfig.backgroundColor ?? legendTheme.backgroundColor ?? legendDefaults.backgroundColor,
    borderWidth: partialConfig.borderWidth ?? legendTheme.borderWidth ?? legendDefaults.borderWidth,
    borderColor: partialConfig.borderColor ?? legendTheme.borderColor ?? legendDefaults.borderColor,
    hPadding: partialConfig.hPadding ?? legendTheme.hPadding ?? legendDefaults.hPadding,
    vPadding: partialConfig.vPadding ?? legendTheme.vPadding ?? legendDefaults.vPadding,
    label: partialConfig.label ?? legendTheme.label ?? legendDefaults.label,
    fields: parseLegendFieldConfigs(partialConfig.fields, legendTheme.fields, fieldsDefaultsForLayer),
  };

  return legendConfigComplete;
};

export default parseLegendConfig;
