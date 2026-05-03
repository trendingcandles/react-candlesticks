/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import parseLayerConfigs from '../../config/layer/parseLayerConfigs';
import { Theme } from '../../domain/types/Theme';
import parseLineConfig from '../elements/line/parseLineConfig';
import { assertNonNegativeNumber, assertPositiveNumber } from '../utils/validateNumber';
import parsePanelControlsConfig from './controls/parsePanelControlsConfig';
import { PanelConfig, PanelConfigComplete, panelDefaults } from './PanelConfig';

const parsePanelConfig = (partialConfig: PanelConfig, theme: Theme, panelIndex: number): Omit<PanelConfigComplete, 'yAxes'> => {
  const panelTheme = theme.panels;

  const id = partialConfig.id ?? `panel_${panelIndex}`;
  const heightRatio = assertPositiveNumber(
    partialConfig.heightRatio ?? panelDefaults.heightRatio,
    `${id}.heightRatio`,
  );
  const paddingTop = assertNonNegativeNumber(
    partialConfig.paddingTop ?? panelTheme.paddingTop ?? panelDefaults.paddingTop,
    `${id}.paddingTop`,
  );
  const paddingBottom = assertNonNegativeNumber(
    partialConfig.paddingBottom ?? panelTheme.paddingBottom ?? panelDefaults.paddingBottom,
    `${id}.paddingBottom`,
  );

  const panelConfigCompleteWithoutYAxes: Omit<PanelConfigComplete, 'yAxes'> = {
    id,
    heightRatio,
    paddingTop,
    paddingBottom,
    borderTop: parseLineConfig(partialConfig.borderTop, panelTheme.borderTop),
    layers: parseLayerConfigs(partialConfig.layers, theme.layers, id),
    controls: parsePanelControlsConfig(partialConfig.controls ?? {}, panelTheme.controls),
  };

  return panelConfigCompleteWithoutYAxes;

};

export default parsePanelConfig;
