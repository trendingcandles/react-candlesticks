/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import getCanvasContext from '../../drawing/getCanvasContext';
import drawChart from '../../drawing/chart/drawChart';
import { ChartConfigComplete } from '../../config/chart/ChartConfig';
import { Layout } from '../../domain/types/Layout';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import drawChartCrosshairs from '../../drawing/chart/crosshairs/drawChartCrosshairs';
import clearChartCrosshairs from '../../drawing/chart/crosshairs/clearChartCrosshairs';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import styles from './styles.module.scss';
import { LayerScale } from '../../config/layer/BaseLayerConfig';
import DataPointInfo from '../../domain/types/DataPointInfo';
import ViewportData from '../../domain/types/ViewportData';
import { DrawingRegistry } from '../../config/drawing/DrawingRegistry';
import { ScaleSmoothingConfigComplete, scaleSmoothingDefaults } from '../../config/chart/scaleSmoothing/ScaleSmoothingConfig';
import { ScaleSmoothingState } from '../../metrics/layer/smoothLayerMetrics';

export type ChartCanvasesHandle = {
  requestDraw: (viewportData: ViewportData, layout: Layout, updatePanelMetrics?: (metricsByPanel: Record<string, {panelMetrics: PanelMetrics; layerMetricsByScale: Record<LayerScale['key'], LayerMetrics>;}>) => void) => void;
  requestDrawCrosshairs: (layout: Layout, viewportData: ViewportData, clientX: number, clientY: number, onCrosshairsMove?: (ts: number | null, dataPoint: DataPointInfo | null) => void) => void;
  getDrawingContexts: () => {
    context: CanvasRenderingContext2D;
    axesContext: CanvasRenderingContext2D;
  } | null;
  updateCrosshairsCanvas: (layout: Layout) => void;
  hideCrosshairs: (layout: Layout) => void;
};

export interface ChartCanvasesProps {
  width: number;
  height: number;
  layout: Layout;
  config: ChartConfigComplete;
  panels: PanelConfigComplete[];
  drawingRegistry?: DrawingRegistry;
  showCrosshairsCanvas?: boolean;
  scaleSmoothing?: ScaleSmoothingConfigComplete;
}

const ChartCanvases = forwardRef<ChartCanvasesHandle, ChartCanvasesProps>(function ChartCanvases({
  config,
  panels,
  layout,
  drawingRegistry,
  showCrosshairsCanvas = true,
  scaleSmoothing = scaleSmoothingDefaults,
}, ref) {
  
  const {
    drawingAreaX,
  } = layout;

  const drawingsChartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const axesChartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const crosshairsCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const drawAnimationFrameRef = useRef<number | null>(null);
  const crosshairsAnimationFrameRef = useRef<number | null>(null);
  const scaleSmoothingStateRef = useRef<ScaleSmoothingState>({});

  const metricsByPanelRef = useRef<Record<string, { panelMetrics: PanelMetrics; layerMetricsByScale: Record<LayerScale['key'], LayerMetrics>; }> | null>(null);
  const drawingsContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const axesContextRef = useRef<CanvasRenderingContext2D | null>(null);

  const prevDrawingAreaSizeRef = useRef<{
    width: number;
    height: number;
    dpr: number;
  } | null>(null);
  const prevAxesSizeRef = useRef<{
    width: number;
    height: number;
    dpr: number;
  } | null>(null);
  const prevCrosshairsSizeRef = useRef<{
    width: number;
    height: number;
    dpr: number;
  } | null>(null);

  useEffect(() => {
    scaleSmoothingStateRef.current = {};
  }, [
    config,
    panels,
    scaleSmoothing.enabled,
    scaleSmoothing.durationMs,
    scaleSmoothing.expandImmediate,
  ]);

  const draw = useCallback((viewportData: ViewportData, layout: Layout, updatePanelMetrics?: (metricsByPanel: Record<string, {panelMetrics: PanelMetrics; layerMetricsByScale: Record<LayerScale['key'], LayerMetrics>;}>) => void) => {
    const drawingsContext = getCanvasContext(drawingsChartCanvasRef, layout.drawingAreaWidth, layout.chartHeight, layout.dpr, prevDrawingAreaSizeRef.current);
    const axesContext = getCanvasContext(axesChartCanvasRef, layout.chartWidth, layout.chartHeight, layout.dpr, prevAxesSizeRef.current);
    if (drawingsContext && axesContext) {
      drawingsContextRef.current = drawingsContext;
      axesContextRef.current = axesContext;
      if (!scaleSmoothing.enabled) {
        scaleSmoothingStateRef.current = {};
      }
      const scaleSmoothingRuntime = scaleSmoothing.enabled
        ? {
            config: scaleSmoothing,
            state: scaleSmoothingStateRef.current,
            now: performance.now(),
            shouldContinue: false,
          }
        : undefined;
      metricsByPanelRef.current = drawChart(drawingsContext, axesContext, config, panels, viewportData, layout, drawingRegistry, scaleSmoothingRuntime)!;
      if (updatePanelMetrics) {
        updatePanelMetrics(metricsByPanelRef.current);
      }
      if (scaleSmoothingRuntime?.shouldContinue) {
        drawAnimationFrameRef.current = requestAnimationFrame(() => {
          drawAnimationFrameRef.current = null;
          draw(viewportData, layout, updatePanelMetrics);
        });
      }
    }
    prevDrawingAreaSizeRef.current = {
      width: layout.drawingAreaX1,
      height: layout.chartHeight,
      dpr: layout.dpr,
    };
    prevAxesSizeRef.current = {
      width: layout.chartWidth,
      height: layout.chartHeight,
      dpr: layout.dpr,
    };
  }, [config, drawingRegistry, panels, scaleSmoothing]);

  const requestDraw = useCallback((viewportData: ViewportData, layout: Layout, updatePanelMetrics?: (metricsByPanel: Record<string, {panelMetrics: PanelMetrics; layerMetricsByScale: Record<LayerScale['key'], LayerMetrics>;}>) => void) => {
    if (drawAnimationFrameRef.current !== null) {
      cancelAnimationFrame(drawAnimationFrameRef.current);
    }
    drawAnimationFrameRef.current = requestAnimationFrame(() => {
      drawAnimationFrameRef.current = null;
      draw(viewportData, layout, updatePanelMetrics);
    });
  }, [draw]);

  const drawCrosshairs = useCallback((layout: Layout, viewportData: ViewportData, clientX: number, clientY: number, onCrosshairsMove?: (ts: number | null, dataPoint: DataPointInfo | null) => void) => {
    if (!showCrosshairsCanvas) return;
    const crosshairsContext = getCanvasContext(crosshairsCanvasRef, layout.chartWidth, layout.chartHeight, layout.dpr, prevCrosshairsSizeRef.current, true);
    if (crosshairsContext && metricsByPanelRef.current) {
      drawChartCrosshairs(
        crosshairsContext,
        config,
        panels,
        layout,
        metricsByPanelRef.current,
        viewportData,
        clientX,
        clientY,
        onCrosshairsMove,
      );
    }
    prevCrosshairsSizeRef.current = {
      width: layout.chartWidth,
      height: layout.chartHeight,
      dpr: layout.dpr,
    };
  }, [config, panels, showCrosshairsCanvas]);

  const requestDrawCrosshairs = useCallback((layout: Layout, viewportData: ViewportData, clientX: number, clientY: number, onCrosshairsMove?: (ts: number | null, dataPoint: DataPointInfo | null) => void) => {
    if (!showCrosshairsCanvas) return;
    if (crosshairsAnimationFrameRef.current !== null) {
      cancelAnimationFrame(crosshairsAnimationFrameRef.current);
    }
    crosshairsAnimationFrameRef.current = requestAnimationFrame(() => {
      crosshairsAnimationFrameRef.current = null;
      drawCrosshairs(layout, viewportData, clientX, clientY, onCrosshairsMove);
    });
  }, [drawCrosshairs, showCrosshairsCanvas]);

  const updateCrosshairsCanvas = useCallback((layout: Layout) => {
    const crosshairsContext = getCanvasContext(crosshairsCanvasRef, layout.chartWidth, layout.chartHeight, layout.dpr, prevCrosshairsSizeRef.current, true);
    if (crosshairsContext) {
      clearChartCrosshairs(crosshairsContext);
    }
  }, []);

  const hideCrosshairs = useCallback((layout: Layout) => {
    if (crosshairsAnimationFrameRef.current !== null) {
      cancelAnimationFrame(crosshairsAnimationFrameRef.current);
      crosshairsAnimationFrameRef.current = null;
    }

    const crosshairsContext = getCanvasContext(crosshairsCanvasRef, layout.chartWidth, layout.chartHeight, layout.dpr, prevCrosshairsSizeRef.current, true);
    if (crosshairsContext) {
      clearChartCrosshairs(crosshairsContext);
    }
  }, []);

  const getDrawingContexts = useCallback(() => {
    if (!drawingsContextRef.current || !axesContextRef.current) return null;

    return {
      context: drawingsContextRef.current,
      axesContext: axesContextRef.current,
    };
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      requestDraw,
      requestDrawCrosshairs,
      getDrawingContexts,
      updateCrosshairsCanvas,
      hideCrosshairs,
    }),
    [requestDraw, requestDrawCrosshairs, getDrawingContexts, hideCrosshairs, updateCrosshairsCanvas]
  );

  return (
    <div
      className={styles.canvases}
    >
      <canvas
        ref={drawingsChartCanvasRef}
        className={styles.drawingCanvas}
        style={{
          left: `${drawingAreaX}px`,
        }}
      />
      <canvas
        ref={axesChartCanvasRef}
        className={styles.axesCanvas}
      />
      {showCrosshairsCanvas &&
        <canvas
          id='ch-canvas'
          ref={crosshairsCanvasRef}
          className={styles.crosshairsCanvas}
        />
      }
    </div>
  );

});

ChartCanvases.displayName = 'ChartCanvases';

export default ChartCanvases;
