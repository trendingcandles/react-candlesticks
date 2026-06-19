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
import type { LayerHit } from '../../config/layer/Layer';
import type { LayerRegistry } from '../../config/layer/LayerRegistry';
import type { PanelConfigComplete } from '../../config/panel/PanelConfig';
import type { Layout } from '../../domain/types/Layout';
import type ViewportData from '../../domain/types/ViewportData';
import type { ChartCanvasesHandle } from '../ChartCanvases/ChartCanvases';
import hitTestDrawings, { DrawingHitResult, MetricsByPanel } from '../../drawing/drawing/hitTestDrawings';
import createDrawingPointer from '../../drawing/drawing/createDrawingPointer';
import hitTestLayers, { LayerHitResult } from '../../drawing/layer/hitTestLayers';

interface CurrentRef<T> {
  current: T;
}

interface UseChartInteractionsParams {
  chartCanvasesRef: CurrentRef<ChartCanvasesHandle | null>;
  viewportDataRef: CurrentRef<ViewportData | null>;
  metricsByPanelRef: CurrentRef<MetricsByPanel | null>;
  config: ChartConfigComplete;
  panels: PanelConfigComplete[];
  layout: Layout;
  layerRegistry?: LayerRegistry;
  drawingRegistry?: DrawingRegistry;
  onDrawingHover?: (hit: DrawingHit | null) => void;
  onDrawingClick?: (hit: DrawingHit) => void;
  onLayerHover?: (hit: LayerHit | null) => void;
  onLayerClick?: (hit: LayerHit) => void;
}

type ChartHitResult =
  | { kind: 'drawing'; result: DrawingHitResult }
  | { kind: 'layer'; result: LayerHitResult };

const hitKey = (result: ChartHitResult | null | undefined): string | null => {
  if (!result) return null;

  if (result.kind === 'drawing') {
    const { hit } = result.result;
    return `drawing:${hit.panelId}:${hit.drawingId}:${hit.target ?? ''}`;
  }

  const { hit } = result.result;
  return `layer:${hit.panelId}:${hit.layerId}:${hit.target ?? ''}`;
};

const useChartInteractions = ({
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
}: UseChartInteractionsParams) => {
  const [drawingCursor, setDrawingCursor] = useState<string | undefined>();
  const containerRef = useRef<HTMLDivElement>(null);
  const lastHoverRef = useRef<ChartHitResult | null>(null);
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

  const runLayerHitTest = useCallback((clientX: number, clientY: number): LayerHitResult | null => {
    const container = containerRef.current;
    const viewportData = viewportDataRef.current;
    const metricsByPanel = metricsByPanelRef.current;

    if (!container || !viewportData || !metricsByPanel) return null;

    const { left, top } = container.getBoundingClientRect();
    const chartX = clientX - left;
    const chartY = clientY - top;

    return hitTestLayers(
      clientX,
      clientY,
      chartX,
      chartY,
      config,
      panels,
      layout,
      viewportData,
      metricsByPanel,
      layerRegistry,
    );
  }, [config, layerRegistry, layout, metricsByPanelRef, panels, viewportDataRef]);

  const runChartHitTest = useCallback((clientX: number, clientY: number): ChartHitResult | null => {
    const drawingHit = runDrawingHitTest(clientX, clientY);
    if (drawingHit) return { kind: 'drawing', result: drawingHit };

    const layerHit = runLayerHitTest(clientX, clientY);
    if (layerHit) return { kind: 'layer', result: layerHit };

    return null;
  }, [runDrawingHitTest, runLayerHitTest]);

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
    const next = runChartHitTest(clientX, clientY);
    const previous = lastHoverRef.current;

    if (hitKey(previous) === hitKey(next)) return;

    if (previous?.kind === 'drawing') {
      const { hit, context } = previous.result;
      const previousDrawing = drawingRegistry?.[hit.drawingType];
      previousDrawing?.onHover?.(null, context);
      if (next?.kind !== 'drawing') onDrawingHover?.(null);
    } else if (previous?.kind === 'layer') {
      const { hit, context } = previous.result;
      const previousLayer = context.viewportData.layersData?.layerRegistry?.[hit.layerType] ?? layerRegistry?.[hit.layerType];
      previousLayer?.onHover?.(null, context);
      if (next?.kind !== 'layer') onLayerHover?.(null);
    }

    if (next?.kind === 'drawing') {
      const { hit, context } = next.result;
      const nextDrawing = drawingRegistry?.[hit.drawingType];
      nextDrawing?.onHover?.(hit, context);
      onDrawingHover?.(hit);
      setDrawingCursor(hit.cursor);
    } else if (next?.kind === 'layer') {
      const { hit, context } = next.result;
      const nextLayer = context.viewportData.layersData?.layerRegistry?.[hit.layerType] ?? layerRegistry?.[hit.layerType];
      nextLayer?.onHover?.(hit, context);
      onLayerHover?.(hit);
      setDrawingCursor(hit.cursor);
    } else if (previous) {
      setDrawingCursor(undefined);
    }

    lastHoverRef.current = next;
  }, [drawingRegistry, layerRegistry, onDrawingHover, onLayerHover, runChartHitTest]);

  const handleDrawingClick = useCallback((clientX: number, clientY: number) => {
    const result = runChartHitTest(clientX, clientY);
    if (!result) return;

    if (result.kind === 'drawing') {
      const { hit, context } = result.result;
      const drawing = drawingRegistry?.[hit.drawingType];
      drawing?.onClick?.(hit, context);
      onDrawingClick?.(hit);
      return;
    }

    const { hit, context } = result.result;
    const layer = context.viewportData.layersData?.layerRegistry?.[hit.layerType] ?? layerRegistry?.[hit.layerType];
    layer?.onClick?.(hit, context);
    onLayerClick?.(hit);
  }, [drawingRegistry, layerRegistry, onDrawingClick, onLayerClick, runChartHitTest]);

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

export default useChartInteractions;
