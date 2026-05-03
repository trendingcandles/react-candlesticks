/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { forwardRef, memo, useCallback, useImperativeHandle, useState } from 'react';
import { PanelControlsConfigComplete } from '../../../../config/panel/controls/PanelControlsConfig';
import { PanelMetrics } from '../../../../domain/types/metrics/PanelMetrics';
import styles from './styles.module.scss';

export interface PanelControlsHandle {
  updateGoToLatestButton: (show: boolean) => void;
}

export interface PanelControlsProps {
  panelMetrics: PanelMetrics;
  panelControls: PanelControlsConfigComplete;
  onGoToLatestButtonClick: () => void;
  onButtonMouseEnterLeave: (enter: boolean) => void;
}

const PanelControls = forwardRef<PanelControlsHandle, PanelControlsProps>(function PanelControls({
  panelMetrics,
  panelControls,
  onGoToLatestButtonClick,
  onButtonMouseEnterLeave,
}, ref) {

  const [ showGoToLatestButton, setShowGoToLatestButton ] = useState(true);

  const {
    topPx,
    heightPx,
  } = panelMetrics;

  const {
    goToLatestButton,
  } = panelControls;

  const updateGoToLatestButton = useCallback((show: boolean) => {
    setShowGoToLatestButton(show);
  }, []);

  useImperativeHandle(ref, () => ({
    updateGoToLatestButton,
  }), [updateGoToLatestButton]);

  const handleGoToLatestButtonMouseEnter = useCallback(() => {
    onButtonMouseEnterLeave(true);
  }, [onButtonMouseEnterLeave]);

  const handleGoToLatestButtonMouseLeave = useCallback(() => {
    onButtonMouseEnterLeave(false);
  }, [onButtonMouseEnterLeave]);

  if (goToLatestButton && showGoToLatestButton) {
    return (
      <button
        className={styles.goToLatestButton}
        style={{
          right: `${8}px`,
          top: `${topPx + heightPx - 48}px`,
        }}
        onMouseEnter={handleGoToLatestButtonMouseEnter}
        onMouseLeave={handleGoToLatestButtonMouseLeave}
        onClick={onGoToLatestButtonClick}
      >
        ❯❯
      </button>
    );
  }

});

PanelControls.displayName = 'PanelControls';

export default memo(PanelControls);
