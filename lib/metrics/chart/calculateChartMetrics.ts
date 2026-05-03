/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { Layout } from '../../domain/types/Layout';
import { ChartMetrics } from '../../domain/types/metrics/ChartMetrics';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';

const calculateChartMetrics = (
  panels: PanelConfigComplete[],
  layout: Layout,
): ChartMetrics | null => {

  const totalPanelsHeightUnits = panels.map(p => p.heightRatio).reduce((sum, h) => sum + h, 0);

  const panelMetricsByKey: Record<string, PanelMetrics> = {};
  let panelTopPx = 0;
  for (let i = 0; i < panels.length; i++) {
    const panel = panels[i];
    const panelHeightPx = Math.floor(layout.drawingAreaHeight * (panel.heightRatio / totalPanelsHeightUnits));
    const panelBottomPx = panelTopPx + panelHeightPx;

    panelMetricsByKey[panel.id] = {
      position: i,
      topPx: panelTopPx,
      heightPx: panelHeightPx,
      bottomPx: panelBottomPx,
      paddedTopPx: panelTopPx + panel.paddingTop,
      paddedHeightPx: panelHeightPx - (panel.paddingTop + panel.paddingBottom),
      paddedBottomPx: panelBottomPx - panel.paddingBottom,
    };
    panelTopPx += panelHeightPx;
  }

  return {
    totalPanelsHeightUnits,
    getPanelMetrics: (panelKey: string) => panelMetricsByKey[panelKey],
  };
};

export default calculateChartMetrics;
