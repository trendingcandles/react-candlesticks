/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { createRef, forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

import styles from './styles.module.scss';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import { Layout } from '../../domain/types/Layout';
import PanelUIs, { PanelUIsHandle } from './PanelUIs/PanelUIs';
import { DataPoint } from '../../domain/types/DataPoint';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import { LayerScale } from '../../config/layer/BaseLayerConfig';
import DataPointInfo from '../../domain/types/DataPointInfo';

export type UisHandle = {
  updatePanelMetrics?: (metricsByPanel: Record<string, { panelMetrics: PanelMetrics; layerMetricsByScale: Record<LayerScale['key'], LayerMetrics>; }>) => void;
  updateLegends: (dataPoint: DataPointInfo | null, latestDataPoint?: DataPoint) => void;
  updateGoToLatestButton: (show: boolean) => void;
};

export interface UIsProps {
  layout: Layout;
  panels: PanelConfigComplete[];
  onGoToLatest: () => void;
  onButtonMouseEnterLeave: (enter: boolean) => void;
}

const UIs = forwardRef<UisHandle, UIsProps>(function UIs({
  layout,
  panels,
  onGoToLatest,
  onButtonMouseEnterLeave,
}, ref) {

  const {
    drawingAreaX,
    drawingAreaY,
    drawingAreaWidth,
    drawingAreaHeight,
  } = layout;

  const panelUisRefs = useRef<Record<string, React.RefObject<PanelUIsHandle>>>({});

  useEffect(() => {
    const newRefs: Record<string, React.RefObject<PanelUIsHandle>> = {};
    panels.forEach(panel => {
      // Preserve existing refs, create new ones only for new layers
      newRefs[panel.id] = panelUisRefs.current[panel.id] ?? createRef<PanelUIsHandle>();
    });
    panelUisRefs.current = newRefs;
  }, [panels]);

  const [ metricsByPanel, setMetricsByPanel ] = useState<Record<string, { panelMetrics: PanelMetrics; layerMetricsByScale: Record<LayerScale['key'], LayerMetrics>; }>>();

  const updatePanelMetrics = useCallback((metricsByPanel: Record<string, { panelMetrics: PanelMetrics; layerMetricsByScale: Record<LayerScale['key'], LayerMetrics>; }>) => {
    setMetricsByPanel(metricsByPanel);
  }, []);

  const updateLegends = useCallback((dataPoint: DataPointInfo | null, latestDataPoint?: DataPoint) => {
    for (let i = 0; i < panels.length; i++) {
      const panel = panels[i];
      panelUisRefs.current[panel.id].current?.updateLegends(dataPoint, latestDataPoint);
    }
  }, [panels]);

  const updateGoToLatestButton = useCallback((show: boolean) => {
    for (let i = 0; i < panels.length; i++) {
      const panel = panels[i];
      panelUisRefs.current[panel.id].current?.updateGoToLatestButton(show);
    }
  }, [panels]);

  useImperativeHandle(
    ref,
    () => ({
      updatePanelMetrics,
      updateLegends,
      updateGoToLatestButton,
    }),
    [updatePanelMetrics, updateLegends, updateGoToLatestButton]
  );

  return (
    <div
      className={styles.uis}
      style={{
        left: `${drawingAreaX}px`,
        top: `${drawingAreaY}px`,
        width: `${drawingAreaWidth}px`,
        height: `${drawingAreaHeight}px`,
      }}
    >
      {panels.map(panel => (
        <PanelUIs
          ref={panelUisRefs.current[panel.id]}
          key={panel.id}
          panel={panel}
          panelMetrics={metricsByPanel?.[panel.id]?.panelMetrics}
          onGoToLatest={onGoToLatest}
          onButtonMouseEnterLeave={onButtonMouseEnterLeave}
        />
      ))}
    </div>
  );

});

UIs.displayName = 'UIs';

export default memo(UIs);
