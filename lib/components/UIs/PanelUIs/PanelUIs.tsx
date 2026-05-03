/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { createRef, forwardRef, memo, useEffect, useImperativeHandle, useRef } from 'react';

import { DataPoint } from '../../../domain/types/DataPoint';
import { PanelConfigComplete } from '../../../config/panel/PanelConfig';
import { PanelMetrics } from '../../../domain/types/metrics/PanelMetrics';
import Legend, { LegendHandle } from './Legend/Legend';
import styles from './styles.module.scss';
import PanelControls, { PanelControlsHandle } from './PanelControls/PanelControls';
import DataPointInfo from '../../../domain/types/DataPointInfo';

export interface PanelUIsHandle {
  updateLegends: (dataPoint: DataPointInfo | null, latestDataPoint?: DataPoint) => void;
  updateGoToLatestButton: (show: boolean) => void;
}

export interface PanelUIsProps {
  panel: PanelConfigComplete;
  panelMetrics?: PanelMetrics;
  onGoToLatest: () => void;
  onButtonMouseEnterLeave: (enter: boolean) => void;
}

const PanelUIs = forwardRef<PanelUIsHandle, PanelUIsProps>(function PanelUIs({
  panel,
  panelMetrics,
  onGoToLatest,
  onButtonMouseEnterLeave,
}, ref) {

  const {
    layers,
    controls,
  } = panel;

  const hasLegends = layers.some(l => l.legend);

  const legendRefs = useRef<Record<string, React.RefObject<LegendHandle>>>({});
  const controlsRef = useRef<PanelControlsHandle>(null)

  useEffect(() => {
    const newRefs: Record<string, React.RefObject<LegendHandle>> = {};
    layers.forEach(layer => {
      // Preserve existing refs, create new ones only for new layers
      newRefs[layer.id] = legendRefs.current[layer.id] ?? createRef<LegendHandle>();
    });
    legendRefs.current = newRefs;
  }, [layers]);

  useImperativeHandle(ref, () => ({
    updateLegends: (dataPoint: DataPointInfo | null, latestDataPoint?: DataPoint) => {
      for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        const legendRef = legendRefs.current[layer.id];
        if (legendRef?.current) {
          legendRef.current.update(dataPoint, latestDataPoint);
        }
      }
    },
    updateGoToLatestButton: (show: boolean) => {
      controlsRef.current?.updateGoToLatestButton(show);
    }
  }), [layers]);

  if (hasLegends && panelMetrics) {
    return (
      <>
        <div
          className={styles.panelUis}
          style={{
            top: `${panelMetrics.topPx}px`,
            height: `${panelMetrics.heightPx}px`,
          }}
        >

          {layers.filter(l => l.legend).map(layer => (
            <Legend
              ref={legendRefs.current[layer.id]}
              key={layer.id}
              layer={layer}
              legend={layer.legend!}
            />
          ))}
        </div>

        {controls.goToLatestButton &&
          <PanelControls
            ref={controlsRef}
            panelMetrics={panelMetrics}
            panelControls={controls}
            onGoToLatestButtonClick={onGoToLatest}
            onButtonMouseEnterLeave={onButtonMouseEnterLeave}
          />
        }
      </>
    );
  }

});

PanelUIs.displayName = 'PanelUIs';

export default memo(PanelUIs);
