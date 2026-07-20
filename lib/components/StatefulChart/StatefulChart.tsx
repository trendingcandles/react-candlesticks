/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
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
import { DrawingRegistry } from '../../config/drawing/DrawingRegistry';
import type { DrawingHit } from '../../config/drawing/Drawing';
import { LayerRegistry } from '../../config/layer/LayerRegistry';
import type { LayerHit } from '../../config/layer/Layer';
import { MetricsByPanel } from '../../drawing/drawing/hitTestDrawings';
import useChartInteractions from './useChartInteractions';
import styles from './styles.module.scss';
import { ScaleSmoothingConfigComplete, scaleSmoothingDefaults } from '../../config/chart/scaleSmoothing/ScaleSmoothingConfig';
import isoTimestampToMs from '../../utils/time/isoTimestampToMs';
import {
  ChartCallbackInfo,
  ChartCrosshairOptions,
  ChartCrosshairPosition,
  ChartHandle,
  ChartMarginOptions,
  ChartRangeValue,
  ChartViewport,
  ChartViewportCallbackMode,
  ChartViewportChangeSource,
  ChartVisibleRange,
} from '../Chart/ChartHandle';

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
  onScroll?: (newScrollOffset: number, info?: ChartCallbackInfo) => void;
  onZoom?: (newIntervalSize: number, info?: ChartCallbackInfo) => void;
  onViewportChange?: (viewport: ChartViewport) => void;
  userViewportCallbackMode?: ChartViewportCallbackMode;
  userViewportCallbackDebounceMs?: number;
  enableScroll: boolean;
  enableZoom: boolean;
  scaleSmoothing?: ScaleSmoothingConfigComplete;
  layerRegistry?: LayerRegistry;
  drawingRegistry?: DrawingRegistry;
  onDrawingHover?: (hit: DrawingHit | null) => void;
  onDrawingClick?: (hit: DrawingHit) => void;
  onLayerHover?: (hit: LayerHit | null) => void;
  onLayerClick?: (hit: LayerHit) => void;
  minimal?: boolean;
}

const StatefulChart = forwardRef<ChartHandle, StatefulChartProps>(function StatefulChart({
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
  onViewportChange,
  userViewportCallbackMode = 'animationFrame',
  userViewportCallbackDebounceMs = 120,
  enableScroll,
  enableZoom,
  scaleSmoothing = scaleSmoothingDefaults,
  layerRegistry,
  drawingRegistry,
  onDrawingHover,
  onDrawingClick,
  onLayerHover,
  onLayerClick,
  minimal = false,
}: StatefulChartProps, ref) {

  const chartCanvasesRef = useRef<ChartCanvasesHandle | null>(null);
  const uisRef = useRef<UisHandle | null>(null);
  const intervalSizeRef = useRef(intervalSize);
  const intervalSizePropRef = useRef(intervalSize);
  const previousIntervalSizeRef = useRef(intervalSize);
  const previousGranularityRef = useRef(granularity);
  const offsetPxRef = useRef<number>(undefined);
  const previousOffsetPxRef = useRef<number>(undefined);
  const viewportDataRef = useRef<ViewportData | null>(null);
  const layersDataRef = useRef<LayersData | null>(null);
  const metricsByPanelRef = useRef<MetricsByPanel | null>(null);
  const crosshairsClearedRef = useRef(false);
  const isOverButtonRef = useRef(false);
  const hasUserInteractedRef = useRef(false);
  const hasAutoScrolledToLatestRef = useRef(false);
  const viewportRef = useRef<ChartViewport | null>(null);
  const onViewportChangeRef = useRef(onViewportChange);
  const userViewportCallbackModeRef = useRef(userViewportCallbackMode);
  const userViewportCallbackDebounceMsRef = useRef(userViewportCallbackDebounceMs);
  const viewportChangeAnimationFrameRef = useRef<number | null>(null);
  const viewportChangeTimeoutRef = useRef<number | null>(null);
  const pendingViewportChangeRef = useRef<ChartViewport | null>(null);
  const crosshairModeRef = useRef<'pointer' | 'programmatic'>('pointer');
  const programmaticCrosshairLockedRef = useRef(false);
  const lastPointerCrosshairPositionRef = useRef<{ clientX: number; clientY: number } | null>(null);

  const {
    containerRef,
    drawingCursor,
    handleDrawingHover,
    handleDrawingClick,
    handleDrawingDragStart,
    handleDrawingDragMove,
    handleDrawingDragEnd,
  } = useChartInteractions({
    chartCanvasesRef,
    viewportDataRef,
    metricsByPanelRef,
    config,
    panels,
    layout,
    layerRegistry,
    drawingRegistry,
    onDrawingHover,
    onDrawingClick,
    onLayerHover,
    onLayerClick,
  });

  useEffect(() => {
    layersDataRef.current = initialLayersData;
  }, [initialLayersData]);

  useEffect(() => {
    onViewportChangeRef.current = onViewportChange;
  }, [onViewportChange]);

  useEffect(() => {
    userViewportCallbackModeRef.current = userViewportCallbackMode;
  }, [userViewportCallbackMode]);

  useEffect(() => {
    userViewportCallbackDebounceMsRef.current = userViewportCallbackDebounceMs;
  }, [userViewportCallbackDebounceMs]);

  useEffect(() => {
    return () => {
      if (viewportChangeAnimationFrameRef.current !== null) {
        cancelAnimationFrame(viewportChangeAnimationFrameRef.current);
        viewportChangeAnimationFrameRef.current = null;
      }
      if (viewportChangeTimeoutRef.current !== null) {
        clearTimeout(viewportChangeTimeoutRef.current);
        viewportChangeTimeoutRef.current = null;
      }
    };
  }, []);

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

  const updatePanelMetrics = useCallback((metricsByPanel: MetricsByPanel) => {
    metricsByPanelRef.current = metricsByPanel;
    uisRef.current?.updatePanelMetrics?.(metricsByPanel);
  }, []);

  const getScrollBounds = useCallback((
    chartIndexProvider: IndexProvider,
    chartIntervalSize: number,
    chartLayout: Layout,
  ) => {
    const { firstDataPointIndex, lastDataPointIndex } = chartIndexProvider;
    return {
      minScrollOffset: firstDataPointIndex !== undefined
        ? firstDataPointIndex * chartIntervalSize - chartLayout.drawingAreaWidth + 1
        : 0,
      maxScrollOffset: lastDataPointIndex !== undefined
        ? (lastDataPointIndex + 1) * chartIntervalSize - chartIntervalSize
        : 0,
    };
  }, []);

  const clampScrollOffset = useCallback((
    chartIndexProvider: IndexProvider,
    chartIntervalSize: number,
    chartLayout: Layout,
    scrollOffset: number,
  ) => {
    const { minScrollOffset, maxScrollOffset } = getScrollBounds(chartIndexProvider, chartIntervalSize, chartLayout);
    return Math.round(Math.max(minScrollOffset, Math.min(scrollOffset, maxScrollOffset)));
  }, [getScrollBounds]);

  const notifyViewportChange = useCallback((
    viewportData: ViewportData,
    scrollOffset: number,
    chartIntervalSize: number,
    source: ChartViewportChangeSource,
  ) => {
    const previousViewport = viewportRef.current;
    if (
      previousViewport &&
      previousViewport.scrollOffset === scrollOffset &&
      previousViewport.intervalWidthPx === chartIntervalSize &&
      previousViewport.startBarIndex === viewportData.startBarIndex &&
      previousViewport.endBarIndex === viewportData.endBarIndex
    ) {
      return;
    }

    const viewport: ChartViewport = {
      scrollOffset,
      intervalWidthPx: chartIntervalSize,
      startBarIndex: viewportData.startBarIndex,
      endBarIndex: viewportData.endBarIndex,
      source,
    };
    viewportRef.current = viewport;

    if (source !== 'user') {
      onViewportChangeRef.current?.(viewport);
      return;
    }

    const callbackMode = userViewportCallbackModeRef.current;
    if (callbackMode === 'none') {
      if (viewportChangeAnimationFrameRef.current !== null) {
        cancelAnimationFrame(viewportChangeAnimationFrameRef.current);
        viewportChangeAnimationFrameRef.current = null;
      }
      if (viewportChangeTimeoutRef.current !== null) {
        clearTimeout(viewportChangeTimeoutRef.current);
        viewportChangeTimeoutRef.current = null;
      }
      pendingViewportChangeRef.current = null;
      return;
    }

    if (callbackMode === 'sync') {
      if (viewportChangeAnimationFrameRef.current !== null) {
        cancelAnimationFrame(viewportChangeAnimationFrameRef.current);
        viewportChangeAnimationFrameRef.current = null;
      }
      if (viewportChangeTimeoutRef.current !== null) {
        clearTimeout(viewportChangeTimeoutRef.current);
        viewportChangeTimeoutRef.current = null;
      }
      pendingViewportChangeRef.current = null;
      onViewportChangeRef.current?.(viewport);
      return;
    }

    pendingViewportChangeRef.current = viewport;

    if (callbackMode === 'debounce') {
      if (viewportChangeAnimationFrameRef.current !== null) {
        cancelAnimationFrame(viewportChangeAnimationFrameRef.current);
        viewportChangeAnimationFrameRef.current = null;
      }
      if (viewportChangeTimeoutRef.current !== null) {
        clearTimeout(viewportChangeTimeoutRef.current);
      }

      viewportChangeTimeoutRef.current = window.setTimeout(() => {
        viewportChangeTimeoutRef.current = null;
        const nextViewport = pendingViewportChangeRef.current;
        pendingViewportChangeRef.current = null;
        if (nextViewport) {
          onViewportChangeRef.current?.(nextViewport);
        }
      }, userViewportCallbackDebounceMsRef.current);
      return;
    }

    if (viewportChangeTimeoutRef.current !== null) {
      clearTimeout(viewportChangeTimeoutRef.current);
      viewportChangeTimeoutRef.current = null;
    }
    if (viewportChangeAnimationFrameRef.current !== null) return;

    viewportChangeAnimationFrameRef.current = requestAnimationFrame(() => {
      viewportChangeAnimationFrameRef.current = null;
      const nextViewport = pendingViewportChangeRef.current;
      pendingViewportChangeRef.current = null;
      if (nextViewport) {
        onViewportChangeRef.current?.(nextViewport);
      }
    });
  }, []);

  const updateGoToLatestButton = useCallback((
    chartIndexProvider: IndexProvider,
    chartIntervalSize: number,
    chartLayout: Layout,
    scrollOffset: number,
  ) => {
    const { lastDataPointIndex } = chartIndexProvider;
    if (lastDataPointIndex === undefined) return;

    const spaceAtEnd = scrollOffset - ((lastDataPointIndex - 1) * chartIntervalSize) + chartLayout.drawingAreaWidth;
    uisRef.current?.updateGoToLatestButton(spaceAtEnd < 0 || spaceAtEnd > chartLayout.drawingAreaWidth / 2);
  }, []);

  const renderViewport = useCallback((
    chartDataMap: DataMap,
    chartIndexProvider: IndexProvider,
    chartIntervalSize: number,
    chartLayout: Layout,
    chartMaxLookback: number,
    chartMaxLookForward: number,
    scrollOffset: number,
    source: ChartViewportChangeSource,
  ) => {
    const clampedScrollOffset = clampScrollOffset(
      chartIndexProvider,
      chartIntervalSize,
      chartLayout,
      scrollOffset,
    );
    const timeScale = chartIndexProvider.getTimescale(chartIntervalSize, clampedScrollOffset, chartLayout.drawingAreaWidth);

    if (layersDataRef.current) {
      updateLayersData(
        layersDataRef.current,
        chartDataMap,
        timeScale.startBarIndex - (chartMaxLookback + LOOKBACK_PAD),
        timeScale.endBarIndex + chartMaxLookForward,
      );
    }

    const viewportData = getViewportData(
      chartIndexProvider,
      timeScale,
      layersDataRef.current!,
      clampedScrollOffset,
      chartLayout.drawingAreaWidth,
      chartIntervalSize,
    );

    offsetPxRef.current = clampedScrollOffset;
    intervalSizeRef.current = chartIntervalSize;
    viewportDataRef.current = viewportData;

    throttledDraw(viewportDataRef.current, chartLayout, updatePanelMetrics);
    updateGoToLatestButton(chartIndexProvider, chartIntervalSize, chartLayout, clampedScrollOffset);

    previousIntervalSizeRef.current = chartIntervalSize;
    previousGranularityRef.current = granularity;
    previousOffsetPxRef.current = clampedScrollOffset;

    notifyViewportChange(viewportData, clampedScrollOffset, chartIntervalSize, source);

    return clampedScrollOffset;
  }, [
    clampScrollOffset,
    granularity,
    notifyViewportChange,
    throttledDraw,
    updateGoToLatestButton,
    updatePanelMetrics,
  ]);

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
      source: ChartViewportChangeSource = 'data',
    ) => {

      intervalSizeRef.current = chartIntervalSize;

      const {
        lastDataPointIndex,
        indexToTimestamp,
        findClosestIndex,
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
        const { minScrollOffset, maxScrollOffset } = getScrollBounds(
          chartIndexProvider,
          chartIntervalSize,
          chartLayout,
        );

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

      previousGranularityRef.current = chartGranularity;

      return renderViewport(
        chartDataMap,
        chartIndexProvider,
        chartIntervalSize,
        chartLayout,
        chartMaxLookback,
        chartMaxLookForward,
        offsetPxRef.current,
        source,
      );
    },
    [getScrollBounds, initialScrollToLatest, renderViewport, scrollToLatestMargin]
  );

  const toTimestampMs = useCallback((value: number | string | Date): number => {
    if (value instanceof Date) return value.getTime();
    if (typeof value === 'string') return isoTimestampToMs(value);
    return value;
  }, []);

  const resolveRangeIndex = useCallback((value: ChartRangeValue, type?: ChartVisibleRange['type']): number => {
    if (type === 'barIndex') return Math.round(Number(value));
    if (type === 'timestamp' || value instanceof Date || typeof value === 'string') {
      return indexProvider.findClosestIndex(toTimestampMs(value));
    }
    return Math.round(value);
  }, [indexProvider, toTimestampMs]);

  const applyViewport = useCallback((
    nextIntervalSize: number,
    nextScrollOffset: number,
    source: ChartViewportChangeSource,
  ) => {
    const previousScrollOffset = previousOffsetPxRef.current;
    const previousIntervalSize = intervalSizeRef.current;
    const clampedIntervalSize = Math.max(1, nextIntervalSize);

    hasUserInteractedRef.current = source === 'user' || source === 'api' || hasUserInteractedRef.current;

    const renderedScrollOffset = renderViewport(
      dataMap,
      indexProvider,
      clampedIntervalSize,
      layout,
      maxLookback,
      maxLookForward,
      nextScrollOffset,
      source,
    );

    if (renderedScrollOffset !== previousScrollOffset) {
      onScroll?.(renderedScrollOffset, { source });
    }
    if (clampedIntervalSize !== previousIntervalSize) {
      onZoom?.(clampedIntervalSize, { source });
    }

    return renderedScrollOffset;
  }, [
    dataMap,
    indexProvider,
    layout,
    maxLookback,
    maxLookForward,
    onScroll,
    onZoom,
    renderViewport,
  ]);

  const setScrollPosition = useCallback((scrollOffset: number) => {
    applyViewport(intervalSizeRef.current, scrollOffset, 'api');
  }, [applyViewport]);

  const scrollToLatest = useCallback((options?: ChartMarginOptions) => {
    const { lastDataPointIndex } = indexProvider;
    const marginBars = options?.marginBars ?? scrollToLatestMargin;
    const chartIntervalSize = intervalSizeRef.current;
    const newScrollOffset = lastDataPointIndex !== undefined
      ? lastDataPointIndex * chartIntervalSize -
        (layout.drawingAreaWidth - chartIntervalSize * marginBars)
      : 0;

    applyViewport(chartIntervalSize, newScrollOffset, 'api');
  }, [applyViewport, indexProvider, layout.drawingAreaWidth, scrollToLatestMargin]);

  const fitContent = useCallback((options?: ChartMarginOptions) => {
    const { firstDataPointIndex, lastDataPointIndex } = indexProvider;
    if (firstDataPointIndex === undefined || lastDataPointIndex === undefined) {
      applyViewport(intervalSizeRef.current, 0, 'api');
      return;
    }

    const marginBars = options?.marginBars ?? 0;
    const bars = Math.max(1, lastDataPointIndex - firstDataPointIndex + 1);
    const nextIntervalSize = Math.max(1, layout.drawingAreaWidth / Math.max(1, bars + marginBars * 2));
    const nextScrollOffset = (firstDataPointIndex - marginBars) * nextIntervalSize;

    applyViewport(nextIntervalSize, nextScrollOffset, 'api');
  }, [applyViewport, indexProvider, layout.drawingAreaWidth]);

  const setVisibleRange = useCallback((range: ChartVisibleRange) => {
    const fromIndex = resolveRangeIndex(range.from, range.type);
    const toIndex = resolveRangeIndex(range.to, range.type);
    const startIndex = Math.min(fromIndex, toIndex);
    const endIndex = Math.max(fromIndex, toIndex);
    const marginBars = range.marginBars ?? 0;
    const spanBars = Math.max(1, endIndex - startIndex + 1);
    const nextIntervalSize = fromIndex === toIndex
      ? intervalSizeRef.current
      : Math.max(1, layout.drawingAreaWidth / Math.max(1, spanBars + marginBars * 2));
    const nextScrollOffset = (startIndex - marginBars) * nextIntervalSize;

    applyViewport(nextIntervalSize, nextScrollOffset, 'api');
  }, [applyViewport, layout.drawingAreaWidth, resolveRangeIndex]);

  const updateLegendsForCrosshair = useCallback((dataPoint: DataPointInfo | null) => {
    uisRef.current?.updateLegends(
      dataPoint,
      viewportDataRef.current ? viewportDataRef.current.data[viewportDataRef.current.data.length - 1] : undefined,
    );
  }, []);

  const resolveCrosshairBarIndex = useCallback((position: ChartCrosshairPosition): number | undefined => {
    if (position.barIndex !== undefined) return position.barIndex;
    if (position.timestamp !== undefined) return indexProvider.findClosestIndex(toTimestampMs(position.timestamp));
    return undefined;
  }, [indexProvider, toTimestampMs]);

  const resolveCrosshairY = useCallback((position: ChartCrosshairPosition): number | undefined => {
    if (position.y !== undefined) return position.y;
    if (position.value === undefined) return undefined;

    const metricsByPanel = metricsByPanelRef.current;
    if (!metricsByPanel) return undefined;

    const panel = position.panelId !== undefined
      ? panels.find(({ id }) => id === position.panelId)
      : panels[0];
    if (!panel) return undefined;

    const panelMetrics = metricsByPanel[panel.id];
    if (!panelMetrics) return undefined;

    const scaleKey = position.scaleKey ?? Object.keys(panelMetrics.layerMetricsByScale)[0];
    const layerMetrics = scaleKey ? panelMetrics.layerMetricsByScale[scaleKey] : undefined;

    return layerMetrics?.valueToY(position.value);
  }, [panels]);

  const resolveCrosshairDefaultY = useCallback((position: ChartCrosshairPosition): number => {
    const metricsByPanel = metricsByPanelRef.current;
    const panel = position.panelId !== undefined
      ? panels.find(({ id }) => id === position.panelId)
      : panels[0];
    const panelMetrics = panel && metricsByPanel?.[panel.id]?.panelMetrics;

    if (panelMetrics) {
      return panelMetrics.topPx + panelMetrics.heightPx / 2;
    }

    return layout.drawingAreaY + layout.drawingAreaHeight / 2;
  }, [layout.drawingAreaHeight, layout.drawingAreaY, panels]);

  const drawCrosshairAtPosition = useCallback((position: ChartCrosshairPosition) => {
    const viewportData = viewportDataRef.current;
    const container = containerRef.current;
    if (!viewportData || !container) return;

    const {
      metadata: {
        intervalSize: chartIntervalSize,
        scrollOffset,
      },
    } = viewportData.timeScale;

    const barIndex = resolveCrosshairBarIndex(position);
    const chartX = position.x ?? (
      barIndex === undefined
        ? undefined
        : layout.drawingAreaX + barIndex * chartIntervalSize - scrollOffset
    );
    if (chartX === undefined) return;

    const chartY = resolveCrosshairY(position) ?? resolveCrosshairDefaultY(position);
    if (
      chartX < layout.drawingAreaX ||
      chartX > layout.drawingAreaX1 ||
      chartY < layout.drawingAreaY ||
      chartY > layout.drawingAreaY1
    ) {
      return;
    }

    const { left, top } = container.getBoundingClientRect();

    throttledCrosshairsDraw(
      layout,
      viewportData,
      left + chartX,
      top + chartY,
      (_ts: number | null, dataPoint: DataPointInfo | null) => updateLegendsForCrosshair(dataPoint),
    );
  }, [
    containerRef,
    layout,
    resolveCrosshairBarIndex,
    resolveCrosshairDefaultY,
    resolveCrosshairY,
    throttledCrosshairsDraw,
    updateLegendsForCrosshair,
  ]);

  const setCrosshairPosition = useCallback((
    position: ChartCrosshairPosition,
    options?: ChartCrosshairOptions,
  ) => {
    crosshairModeRef.current = 'programmatic';
    programmaticCrosshairLockedRef.current = options?.lock ?? false;
    crosshairsClearedRef.current = false;
    drawCrosshairAtPosition(position);
  }, [drawCrosshairAtPosition]);

  const clearCrosshairPosition = useCallback(() => {
    crosshairModeRef.current = 'pointer';
    programmaticCrosshairLockedRef.current = false;
    lastPointerCrosshairPositionRef.current = null;
    crosshairsClearedRef.current = true;
    chartCanvasesRef.current?.hideCrosshairs(layout);
    updateLegendsForCrosshair(null);
  }, [layout, updateLegendsForCrosshair]);

  useImperativeHandle(
    ref,
    () => ({
      setVisibleRange,
      setScrollPosition,
      fitContent,
      scrollToLatest,
      setCrosshairPosition,
      clearCrosshairPosition,
      getViewport: () => viewportRef.current,
    }),
    [
      clearCrosshairPosition,
      fitContent,
      scrollToLatest,
      setCrosshairPosition,
      setScrollPosition,
      setVisibleRange,
    ],
  );

  // If config, panels, data (and derived), intervalSize, granularity or layout change...
  useEffect(() => {
    const nextIntervalSize = intervalSize !== intervalSizePropRef.current
      ? intervalSize
      : intervalSizeRef.current;

    intervalSizePropRef.current = intervalSize;

    handleDataConfigOrScrollChange(
      dataMap,
      indexProvider,
      nextIntervalSize,
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

  const drawCrosshairsAtClientPosition = useCallback((clientX: number, clientY: number) => {
    lastPointerCrosshairPositionRef.current = { clientX, clientY };
    crosshairsClearedRef.current = false;
    handleDrawingHover(clientX, clientY);
    if (viewportDataRef.current) {
      throttledCrosshairsDraw(
        layout,
        viewportDataRef.current,
        clientX,
        clientY,
        (_ts: number | null, dataPoint: DataPointInfo | null) => updateLegendsForCrosshair(dataPoint),
      );
    }
  }, [handleDrawingHover, layout, throttledCrosshairsDraw, updateLegendsForCrosshair]);

  const handleScroll = useCallback(
    (deltaX: number, _deltaY: number, _wheel?: boolean, clientX?: number, clientY?: number) => {
      if (deltaX !== 0) {
        const currentIntervalSize = intervalSizeRef.current;
        hasUserInteractedRef.current = true;
        const newScrollOffset = handleDataConfigOrScrollChange(
          dataMap,
          indexProvider,
          currentIntervalSize,
          granularity,
          layout,
          maxLookback,
          maxLookForward,
          deltaX,
          'user',
        );
        if (onScroll) {
          onScroll(newScrollOffset, { source: 'user' });
        }
        const crosshairClientPosition = clientX !== undefined && clientY !== undefined
          ? { clientX, clientY }
          : lastPointerCrosshairPositionRef.current;
        if (crosshairClientPosition && !isOverButtonRef.current) {
          drawCrosshairsAtClientPosition(crosshairClientPosition.clientX, crosshairClientPosition.clientY);
        }
      }
    },
    [
      handleDataConfigOrScrollChange,
      dataMap,
      indexProvider,
      granularity,
      layout,
      maxLookback,
      maxLookForward,
      onScroll,
      drawCrosshairsAtClientPosition,
    ],
  );

  const handleMouseMove = useCallback((clientX: number, clientY: number) => {
    if (crosshairModeRef.current === 'programmatic') {
      if (programmaticCrosshairLockedRef.current) return;
      crosshairModeRef.current = 'pointer';
      programmaticCrosshairLockedRef.current = false;
    }

    drawCrosshairsAtClientPosition(clientX, clientY);
  }, [drawCrosshairsAtClientPosition]);

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
      if (newIntervalSize !== currentIntervalSize) {
        handleDataConfigOrScrollChange(
          dataMap,
          indexProvider,
          newIntervalSize,
          granularity,
          layout,
          maxLookback,
          maxLookForward,
          0,
          'user',
        );
        onZoom?.(newIntervalSize, { source: 'user' });
      }
    }
  }, [
    dataMap,
    granularity,
    handleDataConfigOrScrollChange,
    indexProvider,
    layout,
    maxLookback,
    maxLookForward,
    onZoom,
  ]);

  const handleGoToLatestButtonClick = useCallback(() => {
    hasUserInteractedRef.current = true;
    if (crosshairsClearedRef.current === false) {
      chartCanvasesRef.current?.hideCrosshairs(layout);
      crosshairsClearedRef.current = true;
    }
    scrollToLatest();
  }, [
    layout,
    scrollToLatest,
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
      ref={containerRef}
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
        drawingRegistry={drawingRegistry}
        showCrosshairsCanvas={minimal === false}
        scaleSmoothing={scaleSmoothing}
      />
      {!minimal &&
        <InteractiveArea
          onScroll={handleScroll}
          onMouseMove={handleMouseMove}
          onClick={handleDrawingClick}
          onPointerDragStart={handleDrawingDragStart}
          onPointerDragMove={handleDrawingDragMove}
          onPointerDragEnd={handleDrawingDragEnd}
          cursor={drawingCursor}
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

});

StatefulChart.displayName = 'StatefulChart';

export default memo(StatefulChart);
