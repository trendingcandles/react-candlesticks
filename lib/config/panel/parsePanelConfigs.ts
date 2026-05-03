/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { Theme } from '../../domain/types/Theme';
import { PanelConfig, PanelConfigComplete } from './PanelConfig';
import parsePanelConfig from './parsePanelConfig';

const parsePanelConfigs = (partialPanelConfigs: readonly[PanelConfig, ...PanelConfig[]], theme: Theme): Omit<PanelConfigComplete, 'yAxes'>[] => {
  const panelConfigs = partialPanelConfigs.map((panel, panelIndex) => parsePanelConfig(panel, theme, panelIndex));
  const panelIds = panelConfigs.map(panel => panel.id);
  const duplicatePanelIds = panelIds.filter((id, index) => panelIds.indexOf(id) !== index);

  if (duplicatePanelIds.length > 0) {
    throw new Error(`Duplicate panel ids found: ${[...new Set(duplicatePanelIds)].join(', ')}`);
  }

  return panelConfigs;
};

export default parsePanelConfigs;
