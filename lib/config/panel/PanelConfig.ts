/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { PanelYAxes } from '../../drawing/panel/getPanelYAxes';
import { LayerConfig } from '../../config/layer/LayerConfig';
import { BaseLayerConfigComplete } from '../layer/BaseLayerConfig';
import { LineConfig, LineConfigComplete } from '../elements/line/LineConfig';
import { PanelControlsConfig, PanelControlsConfigComplete, PanelControlsTheme } from './controls/PanelControlsConfig';
import { DrawingConfig, DrawingConfigComplete } from '../drawing/DrawingConfig';

export interface PanelConfigComplete {
  id: string;
  heightRatio: number;
  paddingTop: number;
  paddingBottom: number;
  borderTop: null | LineConfigComplete;
  layers: BaseLayerConfigComplete[];
  drawings: DrawingConfigComplete[];
  controls: PanelControlsConfigComplete;
  yAxes: PanelYAxes;
}

export interface PanelConfig {
  id?: string;
  heightRatio?: number;
  paddingTop?: number;
  paddingBottom?: number;
  borderTop?: LineConfig;
  layers: LayerConfig[];
  drawings?: DrawingConfig[];
  controls?: PanelControlsConfig;
}

export interface PanelTheme {
  paddingTop: number;
  paddingBottom: number;
  borderTop: LineConfigComplete;
  controls: PanelControlsTheme;
}

export const panelDefaults: Pick<PanelConfigComplete, 'heightRatio' | 'paddingTop' | 'paddingBottom'> = {
  heightRatio: 1,
  paddingTop: 16,
  paddingBottom: 16,
};
