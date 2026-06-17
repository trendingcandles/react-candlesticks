/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { useCallback, useRef, useState } from 'react';
import type { ChartConfigComplete } from '../../config/chart/ChartConfig';
import type { DrawingHit } from '../../config/drawing/Drawing';
import type { DrawingRegistry } from '../../config/drawing/DrawingRegistry';
import type { PanelConfigComplete } from '../../config/panel/PanelConfig';
import type { Layout } from '../../domain/types/Layout';
import type ViewportData from '../../domain/types/ViewportData';
import type { ChartCanvasesHandle } from '../ChartCanvases/ChartCanvases';
import hitTestDrawings, { DrawingHitResult, MetricsByPanel } from '../../drawing/drawing/hitTestDrawings';

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

  return {
    containerRef,
    drawingCursor,
    handleDrawingHover,
    handleDrawingClick,
  };
};

export default useDrawingInteractions;
