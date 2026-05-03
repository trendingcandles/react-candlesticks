/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import getPanelYAxes from '../../drawing/panel/getPanelYAxes';
import { LayersTopology } from '../../config/layer/createLayerTopology';
import { PanelConfigComplete } from './PanelConfig';

const setPanelYAxis = (partialConfigWithoutYAxes: Omit<PanelConfigComplete, 'yAxes'>, layersTopology: LayersTopology): PanelConfigComplete => {
  const panelConfigComplete: PanelConfigComplete = {
    ...partialConfigWithoutYAxes,
    yAxes: getPanelYAxes(partialConfigWithoutYAxes, layersTopology),
  };

  return panelConfigComplete;
};

const setPanelYAxes = (panelConfigsWithoutYAxes: Omit<PanelConfigComplete, 'yAxes'>[], layersTopology: LayersTopology): PanelConfigComplete[] => {
  return panelConfigsWithoutYAxes.map(panel => setPanelYAxis(panel, layersTopology));
};

export default setPanelYAxes;
