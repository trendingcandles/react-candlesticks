/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { useCallback, useRef, useState } from 'react';
import type { ChartConfigComplete } from '../../config/chart/ChartConfig';
import type { DrawingDragContext, DrawingHit, DrawingHitTestContext, DrawingPointer, DrawingPointerDelta } from '../../config/drawing/Drawing';
import type { DrawingRegistry } from '../../config/drawing/DrawingRegistry';
import type { PanelConfigComplete } from '../../config/panel/PanelConfig';
import type { Layout } from '../../domain/types/Layout';
import type ViewportData from '../../domain/types/ViewportData';
import type { ChartCanvasesHandle } from '../ChartCanvases/ChartCanvases';
import hitTestDrawings, { DrawingHitResult, MetricsByPanel } from '../../drawing/drawing/hitTestDrawings';
import createDrawingPointer from '../../drawing/drawing/createDrawingPointer';

interface CurrentRef<T> {
  current: T;
}

interface UseDrawingInteractionsParams {
  chartCanvasesRef: CurrentRef<ChartCanvasesHandle | null>;
  viewportDataRef: CurrentRef<ViewportData | null>;
  metricsByPanelRef: CurrentRef<MetricsByPanel | null>;
  config: ChartConfigComplete;
  panels: PanelConfigComplete[];
  layout: Layout;
  drawingRegistry?: DrawingRegistry;
  onDrawingHover?: (hit: DrawingHit | null) => void;
  onDrawingClick?: (hit: DrawingHit) => void;
}

const hitKey = (hit: DrawingHit | null | undefined): string | null =>
  hit ? `${hit.panelId}:${hit.drawingId}:${hit.target ?? ''}` : null;

const useDrawingInteractions = ({
  chartCanvasesRef,
  viewportDataRef,
  metricsByPanelRef,
  config,
  panels,
  layout,
  drawingRegistry,
  onDrawingHover,
  onDrawingClick,
}: UseDrawingInteractionsParams) => {
  const [drawingCursor, setDrawingCursor] = useState<string | undefined>();
  const containerRef = useRef<HTMLDivElement>(null);
  const lastDrawingHoverRef = useRef<DrawingHitResult | null>(null);
  const activeDragRef = useRef<DrawingHitResult | null>(null);

  const runDrawingHitTest = useCallback((clientX: number, clientY: number): DrawingHitResult | null => {
    const container = containerRef.current;
    const viewportData = viewportDataRef.current;
    const metricsByPanel = metricsByPanelRef.current;
    const chartContext = chartCanvasesRef.current?.getDrawingContexts?.();

    if (!container || !viewportData || !metricsByPanel || !chartContext) return null;

    const { left, top } = container.getBoundingClientRect();
    const chartX = clientX - left;
    const chartY = clientY - top;

    return hitTestDrawings(
      clientX,
      clientY,
      chartX,
      chartY,
      config,
      panels,
      layout,
      viewportData,
      null,
      metricsByPanel,
      drawingRegistry,
      chartContext.context,
      chartContext.axesContext,
    );
  }, [chartCanvasesRef, config, drawingRegistry, layout, metricsByPanelRef, panels, viewportDataRef]);

  const createCurrentDragContext = useCallback((
    activeDrag: DrawingHitResult,
    clientX: number,
    clientY: number,
  ): DrawingHitTestContext => {
    const container = containerRef.current;
    const { left, top } = container?.getBoundingClientRect() ?? { left: 0, top: 0 };
    const chartX = clientX - left;
    const chartY = clientY - top;
    const panelX = chartX - activeDrag.context.layout.drawingAreaX;
    const panelY = chartY - activeDrag.context.panelMetrics.topPx;

    return {
      ...activeDrag.context,
      pointer: createDrawingPointer({
        clientX,
        clientY,
        chartX,
        chartY,
        panelX,
        panelY,
        panelMetrics: activeDrag.context.panelMetrics,
        layerMetrics: activeDrag.context.layerMetrics,
        viewportData: activeDrag.context.viewportData,
      }),
    };
  }, []);

  const createPointerDelta = (
    start: DrawingPointer,
    current: DrawingPointer,
  ): DrawingPointerDelta => ({
    clientX: current.clientX - start.clientX,
    clientY: current.clientY - start.clientY,
    chartX: current.chartX - start.chartX,
    chartY: current.chartY - start.chartY,
    panelX: current.panelX - start.panelX,
    panelY: current.panelY - start.panelY,
    index: start.index === undefined || current.index === undefined ? undefined : current.index - start.index,
    barIndex: start.barIndex === undefined || current.barIndex === undefined ? undefined : current.barIndex - start.barIndex,
    timestamp: start.timestamp === undefined || current.timestamp === undefined ? undefined : current.timestamp - start.timestamp,
    value: start.value === undefined || current.value === undefined ? undefined : current.value - start.value,
  });

  const handleDrawingHover = useCallback((clientX: number, clientY: number) => {
    const next = runDrawingHitTest(clientX, clientY);
    const previous = lastDrawingHoverRef.current;

    if (hitKey(previous?.hit) === hitKey(next?.hit)) return;

    if (previous) {
      const previousDrawing = drawingRegistry?.[previous.hit.drawingType];
      previousDrawing?.onHover?.(null, previous.context);
    }

    if (next) {
      const nextDrawing = drawingRegistry?.[next.hit.drawingType];
      nextDrawing?.onHover?.(next.hit, next.context);
      onDrawingHover?.(next.hit);
      setDrawingCursor(next.hit.cursor);
    } else if (previous) {
      onDrawingHover?.(null);
      setDrawingCursor(undefined);
    }

    lastDrawingHoverRef.current = next;
  }, [drawingRegistry, onDrawingHover, runDrawingHitTest]);

  const handleDrawingClick = useCallback((clientX: number, clientY: number) => {
    const result = runDrawingHitTest(clientX, clientY);
    if (!result) return;

    const drawing = drawingRegistry?.[result.hit.drawingType];
    drawing?.onClick?.(result.hit, result.context);
    onDrawingClick?.(result.hit);
  }, [drawingRegistry, onDrawingClick, runDrawingHitTest]);

  const handleDrawingDragStart = useCallback((clientX: number, clientY: number): boolean => {
    const result = runDrawingHitTest(clientX, clientY);
    if (!result) return false;

    const drawing = drawingRegistry?.[result.hit.drawingType];
    if (!drawing?.onDrag && !drawing?.onDragStart && !drawing?.onDragEnd) return false;

    activeDragRef.current = result;
    drawing.onDragStart?.(result.hit, result.context);
    setDrawingCursor('grabbing');

    return true;
  }, [drawingRegistry, runDrawingHitTest]);

  const handleDrawingDragMove = useCallback((clientX: number, clientY: number) => {
    const activeDrag = activeDragRef.current;
    if (!activeDrag) return;

    const drawing = drawingRegistry?.[activeDrag.hit.drawingType];
    if (!drawing?.onDrag) return;

    const currentContext = createCurrentDragContext(activeDrag, clientX, clientY);
    const dragContext: DrawingDragContext = {
      ...currentContext,
      hit: activeDrag.hit,
      start: activeDrag.context,
      delta: createPointerDelta(activeDrag.context.pointer, currentContext.pointer),
    };

    drawing.onDrag(dragContext);
  }, [createCurrentDragContext, drawingRegistry]);

  const handleDrawingDragEnd = useCallback((clientX: number, clientY: number) => {
    const activeDrag = activeDragRef.current;
    if (!activeDrag) return;

    const drawing = drawingRegistry?.[activeDrag.hit.drawingType];
    const currentContext = createCurrentDragContext(activeDrag, clientX, clientY);

    drawing?.onDragEnd?.(activeDrag.hit, currentContext);
    activeDragRef.current = null;
    setDrawingCursor(activeDrag.hit.cursor);
  }, [createCurrentDragContext, drawingRegistry]);

  return {
    containerRef,
    drawingCursor,
    handleDrawingHover,
    handleDrawingClick,
    handleDrawingDragStart,
    handleDrawingDragMove,
    handleDrawingDragEnd,
  };
};

export default useDrawingInteractions;
