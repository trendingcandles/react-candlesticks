/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import parseButtonConfig from '../../elements/button/parseButtonConfig';
import { PanelControlsConfig, PanelControlsConfigComplete, PanelControlsTheme } from './PanelControlsConfig';

const parsePanelControlsConfig = (partialConfig: PanelControlsConfig, panelControlsTheme: PanelControlsTheme): PanelControlsConfigComplete => {
  return {
    goToLatestButton: parseButtonConfig(partialConfig.goToLatestButton ?? false, panelControlsTheme.goToLatestButton),
  };
}; 

export default parsePanelControlsConfig;
