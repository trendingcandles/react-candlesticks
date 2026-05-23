/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import type { DataPoint } from '../../domain/types/DataPoint';
import type { ChartConfigComplete } from '../../config/chart/ChartConfig';
import InteractiveArea from '../InteractiveArea';
import ChartCanvases from '../ChartCanvases';
import { ChartCanvasesHandle } from '../ChartCanvases/ChartCanvases';
import throttle from '../../utils/throttle';
import { Layout } from '../../domain/types/Layout';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import { Granularity } from '../../domain/types/Granularity';
import UIs, { UisHandle } from '../UIs/UIs';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import getViewportData from './getViewportData';
import calculateNewScrollOffset from '../../timeScale/core/calculateNewScrollOffset';
import { LayerScale } from '../../config/layer/BaseLayerConfig';
import { LayersData } from '../../domain/types/LayersData';
import { updateLayersData } from '../../data/layers/updateLayersData';
import { IndexProvider } from '../../domain/types/IndexProvider';
import DataPointInfo from '../../domain/types/DataPointInfo';
import ViewportData from '../../domain/types/ViewportData';
import { DataMap } from '../../domain/types/DataMap';
import styles from './styles.module.scss';

const LOOKBACK_PAD = 10;

export interface StatefulChartProps {
  chartWidth: number;
  chartHeight: number;
  intervalSize: number;
  granularity: Granularity;
  config: ChartConfigComplete;
  panels: PanelConfigComplete[];
  layout: Layout;
  indexProvider: IndexProvider;
  dataMap: DataMap;
  initialLayersData: LayersData;
  maxLookback: number;
  maxLookForward: number;
  scrollToLatestMargin: number;
  initialScrollToLatest: boolean;
  onScroll?: (newScrollOffset: number) => void;
  onZoom?: (newIntervalSize: number) => void;
  enableScroll: boolean;
  enableZoom: boolean;
  minimal?: boolean;
}

const StatefulChart = ({
  chartWidth,
  chartHeight,
  intervalSize,
  granularity,
  config,
  panels,
  layout,
  indexProvider,
  dataMap,
  initialLayersData,
  maxLookback,
  maxLookForward,
  scrollToLatestMargin,
  initialScrollToLatest,
  onScroll,
  onZoom,
  enableScroll,
  enableZoom,
  minimal = false,
}: StatefulChartProps) => {

  const chartCanvasesRef = useRef<ChartCanvasesHandle | null>(null);
  const uisRef = useRef<UisHandle | null>(null);
  const intervalSizeRef = useRef(intervalSize);
  const previousIntervalSizeRef = useRef(intervalSize);
  const previousGranularityRef = useRef(granularity);
  const offsetPxRef = useRef<number>(undefined);
  const previousOffsetPxRef = useRef<number>(undefined);
  const viewportDataRef = useRef<ViewportData | null>(null);
  const layersDataRef = useRef<LayersData | null>(null);
  const crosshairsClearedRef = useRef(false);
  const isOverButtonRef = useRef(false);
  const hasUserInteractedRef = useRef(false);
  const hasAutoScrolledToLatestRef = useRef(false);

  useEffect(() => {
    layersDataRef.current = initialLayersData;
  }, [initialLayersData]);

  const throttledDraw = useMemo(
    () => throttle((viewportData: ViewportData, layout: Layout, updatePanelMetrics?: (metricsByPanel: Record<string, {panelMetrics: PanelMetrics; layerMetricsByScale: Record<LayerScale['key'], LayerMetrics>;}>) => void) => {
      chartCanvasesRef.current?.requestDraw(viewportData, layout, updatePanelMetrics);
    }, 16), // ~60fps
    []
  );

  const throttledCrosshairsDraw = useMemo(
    () => throttle((layout: Layout, viewportData: ViewportData, clientX: number, clientY: number, onCrosshairsMove?: (ts: number | null, dataPoint: DataPointInfo | null, latestDataPoint?: DataPoint) => void) => {
      chartCanvasesRef.current?.requestDrawCrosshairs(layout, viewportData, clientX, clientY, onCrosshairsMove);
    }, 16), // ~60fps
    []
  );

  const handleDataConfigOrScrollChange = useCallback(
    (
      chartDataMap: DataMap,
      chartIndexProvider: IndexProvider,
      chartIntervalSize: number,
      chartGranularity: Granularity,
      chartLayout: Layout,
      chartMaxLookback: number,
      chartMaxLookForward: number,
      offsetDelta: number = 0,
    ) => {

      intervalSizeRef.current = chartIntervalSize;

      const {
        firstDataPointIndex,
        lastDataPointIndex,
        indexToTimestamp,
        findClosestIndex,
        getTimescale,
      } = chartIndexProvider;

      const shouldAutoScrollToLatest = (
        initialScrollToLatest &&
        hasUserInteractedRef.current === false &&
        hasAutoScrolledToLatestRef.current === false &&
        offsetDelta === 0 &&
        lastDataPointIndex !== undefined
      );

      if (
        shouldAutoScrollToLatest ||
        offsetDelta !== 0 ||
        offsetPxRef.current === undefined ||
        chartIntervalSize !== previousIntervalSizeRef.current ||
        chartGranularity !== previousGranularityRef.current
      ) {
        const minScrollOffset = firstDataPointIndex !== undefined
          ? firstDataPointIndex * chartIntervalSize - chartLayout.drawingAreaWidth + 1
          : 0;
        const maxScrollOffset = lastDataPointIndex !== undefined
          ? (lastDataPointIndex + 1) * chartIntervalSize - chartIntervalSize
          : 0;

        if (shouldAutoScrollToLatest) {
          offsetPxRef.current = lastDataPointIndex * chartIntervalSize -
            (chartLayout.drawingAreaWidth - chartIntervalSize * scrollToLatestMargin);
          hasAutoScrolledToLatestRef.current = true;
        } else {
          const newScrollOffset = calculateNewScrollOffset(
            previousOffsetPxRef.current ?? 0,
            -offsetDelta,
            indexToTimestamp,
            findClosestIndex,
            chartIntervalSize,
            chartLayout.drawingAreaWidth,
            previousIntervalSizeRef.current,
            chartGranularity !== previousGranularityRef.current,
            minScrollOffset,
            maxScrollOffset,
          );
          offsetPxRef.current = newScrollOffset;
        }
      }

      const timeScale = getTimescale(chartIntervalSize, offsetPxRef.current, chartLayout.drawingAreaWidth);

      if (layersDataRef.current) {
        updateLayersData(layersDataRef.current, chartDataMap, timeScale.startBarIndex - (chartMaxLookback + LOOKBACK_PAD), timeScale.endBarIndex + chartMaxLookForward);
      }

      const viewportData = getViewportData(
        chartIndexProvider,
        timeScale,
        layersDataRef.current!,
        offsetPxRef.current,
        chartLayout.drawingAreaWidth,
        chartIntervalSize,
      );

      viewportDataRef.current = viewportData;

      throttledDraw(viewportDataRef.current, chartLayout, uisRef.current?.updatePanelMetrics);

      if (offsetPxRef.current !== previousOffsetPxRef.current) {
        if (lastDataPointIndex !== undefined) {
          const spaceAtEnd = (offsetPxRef.current - ((lastDataPointIndex - 1) * chartIntervalSize) + chartLayout.drawingAreaWidth);
          uisRef.current?.updateGoToLatestButton(spaceAtEnd < 0 || spaceAtEnd > chartLayout.drawingAreaWidth / 2);
        }
      }

      previousIntervalSizeRef.current = chartIntervalSize;
      previousGranularityRef.current = chartGranularity;
      previousOffsetPxRef.current = offsetPxRef.current;

      return offsetPxRef.current;
    },
    [initialScrollToLatest, scrollToLatestMargin, throttledDraw]
  );

  // If config, panels, data (and derived), intervalSize, granularity or layout change...
  useEffect(() => {
    handleDataConfigOrScrollChange(
      dataMap,
      indexProvider,
      intervalSize,
      granularity,
      layout,
      maxLookback,
      maxLookForward,
    );
    chartCanvasesRef.current?.updateCrosshairsCanvas(layout);
  }, [
    handleDataConfigOrScrollChange,
    config,
    dataMap,
    indexProvider,
    intervalSize,
    granularity,
    layout,
    maxLookback,
    maxLookForward,
  ]);

  const handleScroll = useCallback(
    (deltaX: number /*, deltaY: number, wheel?: boolean*/) => {
      if (deltaX !== 0) {
        hasUserInteractedRef.current = true;
        if (crosshairsClearedRef.current === false) {
          chartCanvasesRef.current?.hideCrosshairs(layout);
          crosshairsClearedRef.current = true;
        }
        const newScrollOffset = handleDataConfigOrScrollChange(
          dataMap,
          indexProvider,
          intervalSize,
          granularity,
          layout,
          maxLookback,
          maxLookForward,
          deltaX,
        );
        if (onScroll) {
          onScroll(newScrollOffset);
        }
      }
    },
    [
      handleDataConfigOrScrollChange,
      dataMap,
      indexProvider,
      intervalSize,
      granularity,
      layout,
      maxLookback,
      maxLookForward,
      onScroll,
    ],
  );

  const handleMouseMove = useCallback((clientX: number, clientY: number) => {
    crosshairsClearedRef.current = false;
    if (viewportDataRef.current) {
      throttledCrosshairsDraw(
        layout,
        viewportDataRef.current,
        clientX, 
        clientY,
        (_ts: number | null, dataPoint: DataPointInfo | null) => uisRef.current?.updateLegends(dataPoint, viewportDataRef.current ? viewportDataRef.current.data[viewportDataRef.current.data.length - 1] : undefined),
      );
    }
  }, [throttledCrosshairsDraw, layout]);

  const handleZoom = useCallback((zoomFactor: number) => {
    if (zoomFactor !== 1) {
      hasUserInteractedRef.current = true;
      if (crosshairsClearedRef.current === false) {
        chartCanvasesRef.current?.hideCrosshairs(layout);
        crosshairsClearedRef.current = true;
      }
      const currentIntervalSize = intervalSizeRef.current;
      let newIntervalSize = currentIntervalSize * zoomFactor;
      if (newIntervalSize < 1) {
        newIntervalSize = 1;
      }
      if (onZoom && newIntervalSize !== currentIntervalSize) {
        onZoom(newIntervalSize);
      }
    }
  }, [onZoom, layout]);

  const handleGoToLatestButtonClick = useCallback(() => {
    hasUserInteractedRef.current = true;
    if (crosshairsClearedRef.current === false) {
      chartCanvasesRef.current?.hideCrosshairs(layout);
      crosshairsClearedRef.current = true;
    }
    const { lastDataPointIndex } = indexProvider;
    const newScrollOffset = lastDataPointIndex !== undefined
      ? lastDataPointIndex * intervalSize -
        (layout.drawingAreaWidth - intervalSize * scrollToLatestMargin)
      : 0;
    const deltaX = (previousOffsetPxRef.current ?? 0) - newScrollOffset;
    handleDataConfigOrScrollChange(
      dataMap,
      indexProvider,
      intervalSize,
      granularity,
      layout,
      maxLookback,
      maxLookForward,
      deltaX,
    );
  }, [
    handleDataConfigOrScrollChange,
    dataMap,
    indexProvider,
    intervalSize,
    granularity,
    layout,
    maxLookback,
    maxLookForward,
    scrollToLatestMargin,
  ]);

  const handleButtonMouseEnterLeave = useCallback((enter: boolean) => {
    isOverButtonRef.current = enter;
    if (isOverButtonRef.current === true) {
      chartCanvasesRef.current?.hideCrosshairs(layout);
      crosshairsClearedRef.current = true;
    } else {
      crosshairsClearedRef.current = false;
    }
  }, [layout]);

  return (
    <div
      className={styles.statefulChart}
      style={{
        backgroundColor: config.backgroundColor,
      }}
    >
      <ChartCanvases
        ref={chartCanvasesRef}
        width={chartWidth}
        height={chartHeight}
        layout={layout}
        config={config}
        panels={panels}
        showCrosshairsCanvas={minimal === false}
      />
      {!minimal &&
        <InteractiveArea
          onScroll={handleScroll}
          onMouseMove={handleMouseMove}
          onZoom={handleZoom}
          enableScroll={enableScroll}
          enableZoom={enableZoom}
        />
      }
      {!minimal &&
        <UIs
          ref={uisRef}
          layout={layout}
          panels={panels}
          onGoToLatest={handleGoToLatestButtonClick}
          onButtonMouseEnterLeave={handleButtonMouseEnterLeave}
        />
      }
    </div>
  );

};

export default memo(StatefulChart);
