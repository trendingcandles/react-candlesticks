/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { PanelMetrics } from './PanelMetrics';

export interface ChartMetrics {
  totalPanelsHeightUnits: number;
  getPanelMetrics: (panelKey: string) => PanelMetrics;
}
