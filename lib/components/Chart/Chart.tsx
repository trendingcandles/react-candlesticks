/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { forwardRef, HTMLAttributes, JSX, memo, ReactNode, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import parseChartConfig from '../../config/chart/parseChartConfig';
import type { DataPoint } from '../../domain/types/DataPoint';
import useResizeObserver from '../../hooks/useResizeObserver';
import useDevicePixelRatio from '../../hooks/useDevicePixelRatio';
import StatefulChart from '../StatefulChart';
import { PanelConfig } from '../../config/panel/PanelConfig';
import parsePanelConfigs from '../../config/panel/parsePanelConfigs';
import { Theme } from '../../domain/types/Theme';
import themes, { ThemeName } from '../../themes/themes';
import resolveTheme from '../../themes/resolveTheme';
import { Granularity } from '../../domain/types/Granularity';
import { GridConfig } from '../../config/chart/grid/GridConfig';
import { CrosshairsConfig } from '../../config/chart/crosshairs/CrosshairsConfig';
import parseConfigComponents from './parseConfigComponents';
import { XAxisConfig } from '../../config/chart/xAxis/XAxisConfig';
import setPanelYAxes from '../../config/panel/setPanelYAxes';
import { BaseLayerConfigComplete } from '../../config/layer/BaseLayerConfig';
import { createLayersData } from '../../data/layers/createLayersData';
import getLayout from '../../layout/getLayout';
import createContinuousIndexProvider from '../../indexProviders/continuous/createContinuousIndexProvider';
import deduceGranularity from '../../data/utils/deduceGranulairty';
import createLayerTopology from '../../config/layer/createLayerTopology';
import styles from './styles.module.scss';
import { BordersConfig } from '../../config/chart/borders/BordersConfig';
import { ScaleSmoothingInput } from '../../config/chart/scaleSmoothing/ScaleSmoothingConfig';
import parseScaleSmoothingConfig from '../../config/chart/scaleSmoothing/parseScaleSmoothingConfig';
import { CustomLayerDefinition } from '../../layers/defineLayer';
import createLayerRegistry from '../../layers/createLayerRegistry';
import { CustomDrawingDefinition } from '../../drawings/defineDrawing';
import createDrawingRegistry from '../../drawings/createDrawingRegistry';
import { DrawingHit } from '../../config/drawing/Drawing';
import { LayerHit } from '../../config/layer/Layer';
import { ChartCallbackInfo, ChartHandle, ChartViewport, ChartViewportCallbackMode } from './ChartHandle';

const EMPTY_LAYER_DEFINITIONS: readonly CustomLayerDefinition[] = [];
const EMPTY_DRAWING_DEFINITIONS: readonly CustomDrawingDefinition[] = [];

interface ChartPropsBase extends Omit<HTMLAttributes<HTMLDivElement>, 'onScroll'> {
  renderMode?: 'full' | 'minimal';
  pixelRatio?: number | 'device';
  width?: number | 'auto';
  height?: number | 'auto';
  intervalWidthPx?: number;
  granularity?: Granularity; // 'm1', 'm5', 'h1', 'd1', ...
  backgroundColor?: string;
  xAxis?: false | XAxisConfig; // undefined → default config, false → disabled, {} → default config
  grid?: false | GridConfig; // undefined → default config, false → disabled, {} → default config
  crosshairs?: false | CrosshairsConfig; // undefined → default config, false → disabled, {} → default config
  borders?: false | BordersConfig; // undefined → default config, false → disabled, {} → default config
  theme?: Theme | ThemeName;
  data: DataPoint[];
  scrollToLatestMargin?: number;
  initialScrollToLatest?: boolean;
  onScroll?: (newScrollOffset: number, info?: ChartCallbackInfo) => void;
  onZoom?: (newIntervalWidthPx: number, info?: ChartCallbackInfo) => void;
  onViewportChange?: (viewport: ChartViewport) => void;
  userViewportCallbackMode?: ChartViewportCallbackMode;
  userViewportCallbackDebounceMs?: number;
  enableScroll?: boolean;
  enableZoom?: boolean;
  scaleSmoothing?: ScaleSmoothingInput;
  layerDefinitions?: readonly CustomLayerDefinition[];
  drawingDefinitions?: readonly CustomDrawingDefinition[];
  onDrawingHover?: (hit: DrawingHit | null) => void;
  onDrawingClick?: (hit: DrawingHit) => void;
  onLayerHover?: (hit: LayerHit | null) => void;
  onLayerClick?: (hit: LayerHit) => void;
}

interface PanelsAsPropChartProps extends ChartPropsBase {
  panels?: readonly [PanelConfig, ...PanelConfig[]]; // optional because panels can be configured as child elements
  children?: never;
}

interface PanelsAsChildrenChartProps extends ChartPropsBase {
  panels?: never;
  children?: ReactNode;
}

type PanelsProps = PanelsAsPropChartProps | PanelsAsChildrenChartProps;

export type ChartProps = ChartPropsBase & PanelsProps;

const Chart = forwardRef<ChartHandle, ChartProps>(function Chart({
  width = 'auto',
  height = 'auto',
  renderMode = 'full',
  pixelRatio = 'device',
  intervalWidthPx = 12,
  granularity,
  backgroundColor,
  xAxis,
  grid,
  crosshairs,
  borders,
  theme = 'light',
  panels,
  data,
  scrollToLatestMargin = 5,
  initialScrollToLatest = false,
  onScroll,
  onZoom,
  onViewportChange,
  userViewportCallbackMode = 'animationFrame',
  userViewportCallbackDebounceMs = 120,
  enableScroll,
  enableZoom,
  scaleSmoothing,
  layerDefinitions = EMPTY_LAYER_DEFINITIONS,
  drawingDefinitions = EMPTY_DRAWING_DEFINITIONS,
  onDrawingHover,
  onDrawingClick,
  onLayerHover,
  onLayerClick,
  children,
  ...props
}: ChartProps, ref): JSX.Element {

  const defaultTimeZoneId = 'UTC';

  const deducedGranularity = useMemo(() => {
    if (granularity) {
      return granularity;
    }

    if (data.length < 2) {
      // Keep empty/loading and first-tick states renderable until granularity
      // can be inferred from at least two timestamps.
      return 'm1';
    }

    return deduceGranularity(data);
  }, [granularity, data]);

  // The `size` variable changes if the Chart element's dimensions change
  const [size, resizeRef] = useResizeObserver<HTMLDivElement>(width === 'auto' || height === 'auto');
  const devicePixelRatio = useDevicePixelRatio();
  const dpr = pixelRatio === 'device' ? devicePixelRatio : pixelRatio;
  const isMinimal = renderMode === 'minimal';
  const effectiveEnableScroll = isMinimal ? (enableScroll ?? false) : (enableScroll ?? true);
  const effectiveEnableZoom = isMinimal ? (enableZoom ?? false) : (enableZoom ?? true);

  const zoomTimeoutRef = useRef<number | null>(null);
  const lastNotifiedZoom = useRef<number>(intervalWidthPx);
  const statefulChartRef = useRef<ChartHandle | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      setVisibleRange: (range) => statefulChartRef.current?.setVisibleRange(range),
      setScrollPosition: (scrollOffset) => statefulChartRef.current?.setScrollPosition(scrollOffset),
      fitContent: (options) => statefulChartRef.current?.fitContent(options),
      scrollToLatest: (options) => statefulChartRef.current?.scrollToLatest(options),
      setCrosshairPosition: (position, options) => statefulChartRef.current?.setCrosshairPosition(position, options),
      clearCrosshairPosition: () => statefulChartRef.current?.clearCrosshairPosition(),
      getViewport: () => statefulChartRef.current?.getViewport() ?? null,
    }),
    [],
  );

  const [effectiveWidth, effectiveHeight] = useMemo(() => {
    return [width === 'auto' ? size.width : width, height === 'auto' ? size.height : height];
  }, [width, height, size]);

  // Panels are either defined using `panels` prop or by React elements
  const effectivePanels = useMemo(() => {
    const panelConfigFromNodes: PanelConfig[] = children ? parseConfigComponents(children) : [];
    const effectivePanels = panels ?? panelConfigFromNodes;

    if (effectivePanels.length === 0) {
      throw new Error(
        'Chart requires at least one panel. ' +
        'Provide `panels` prop or panel components as children.'
      );
    }
    return effectivePanels;
  }, [children, panels]);

  // The `theme` prop value is either an object provided by user or the name of a predefined theme
  const effectiveTheme = useMemo(() => {
    return typeof theme === 'string' ? themes[theme as ThemeName] : resolveTheme(theme); // todo: validate theme
  }, [theme]);

  const layerRegistry = useMemo(
    () => createLayerRegistry(layerDefinitions),
    [layerDefinitions],
  );
  const drawingRegistry = useMemo(
    () => createDrawingRegistry(drawingDefinitions),
    [drawingDefinitions],
  );

  const scaleSmoothingConfig = useMemo(
    () => parseScaleSmoothingConfig(scaleSmoothing),
    [scaleSmoothing],
  );

  // Parse chart config (everything that's not panels/layers)
  const chartConfigComplete = useMemo(() => {
    const chartConfig = {
      backgroundColor,
      xAxis: isMinimal ? (xAxis ?? false) : xAxis,
      grid: isMinimal ? (grid ?? false) : grid,
      crosshairs: isMinimal ? (crosshairs ?? false) : crosshairs,
      borders: isMinimal ? (borders ?? false) : borders,
    };
    return parseChartConfig(chartConfig, effectiveTheme, defaultTimeZoneId);
  }, [backgroundColor, xAxis, grid, crosshairs, borders, effectiveTheme, defaultTimeZoneId, isMinimal]);

  // Parse panel configs and create layer topology
  const { panelConfigs: panelConfigsComplete, layersTopology } = useMemo(() => {
    const panelConfigsWithoutYAxis = parsePanelConfigs(
      effectivePanels as readonly [PanelConfig, ...PanelConfig[]],
      effectiveTheme,
      layerRegistry,
      drawingRegistry,
    );
    const layersTopology = createLayerTopology(panelConfigsWithoutYAxis);
    const panelConfigs = setPanelYAxes(panelConfigsWithoutYAxis, layersTopology);
    return {
      panelConfigs,
      layersTopology,
    };
  }, [effectivePanels, effectiveTheme, layerRegistry, drawingRegistry]);

  // Create layout object
  const layout = useMemo(() =>
    getLayout(effectiveWidth, effectiveHeight, dpr, chartConfigComplete, panelConfigsComplete),
    [effectiveWidth, effectiveHeight, dpr, chartConfigComplete, panelConfigsComplete],
  );

  // Deduce max lookback and look forward
  const { maxLookback, maxLookForward } = useMemo(() => {
    const indicatorLayers = panelConfigsComplete.flatMap(
      p => p.layers.filter((layer): layer is BaseLayerConfigComplete => layer.indicator),
    );
    const maxLookback = Math.max(0, ...indicatorLayers.map(layer => (typeof layer.lookback === 'number' ? layer.lookback : layer.lookback(layer.period))));
    const maxLookForward = Math.max(0, ...indicatorLayers.map(layer => layer.offset));
    return {
      maxLookback,
      maxLookForward,
    };
  }, [panelConfigsComplete]);

  const indexProvider = useMemo(() => {
    return createContinuousIndexProvider(data, deducedGranularity);
  }, [data, deducedGranularity]);

  const layersData = useMemo(() => {
    return createLayersData(
      panelConfigsComplete.flatMap(p => p.layers),
      layersTopology,
      indexProvider.barsLength,
      layerRegistry,
    );
  }, [panelConfigsComplete, layersTopology, indexProvider.barsLength, layerRegistry]);


  const handleZoom = useCallback((newIntervalSize: number, info: ChartCallbackInfo = { source: 'user' }) => {
    if (onZoom) {
      if (zoomTimeoutRef.current !== null) {
        clearTimeout(zoomTimeoutRef.current);
      }
      
      zoomTimeoutRef.current = window.setTimeout(() => {
        const roundedSize = Math.round(newIntervalSize);
        // Only call if it actually changed
        if (roundedSize !== lastNotifiedZoom.current) {
          onZoom(roundedSize, info);
          lastNotifiedZoom.current = roundedSize;
        }
        zoomTimeoutRef.current = null;
      }, 150);
    }
  }, [onZoom]);

  useEffect(() => {
    lastNotifiedZoom.current = Math.round(intervalWidthPx);
  }, [intervalWidthPx]);

  useEffect(() => {
    return () => {
      if (zoomTimeoutRef.current !== null) {
        clearTimeout(zoomTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={resizeRef}
      className={styles.chart}
      {...props}
      style={{
        width: (width === 'auto' ? '100%' : `${width}px`),
        height: (height === 'auto' ? '100%' : `${height}px`),
        ...props.style,
      }}
    >
      {(effectiveWidth > 0 && effectiveHeight > 0) &&
        <StatefulChart
          ref={statefulChartRef}
          chartWidth={effectiveWidth}
          chartHeight={effectiveHeight}
          intervalSize={intervalWidthPx}
          granularity={deducedGranularity}
          config={chartConfigComplete}
          panels={panelConfigsComplete}
          layout={layout}
          indexProvider={indexProvider}
          dataMap={indexProvider.dataMap}
          initialLayersData={layersData}
          maxLookback={maxLookback}
          maxLookForward={maxLookForward}
          scrollToLatestMargin={scrollToLatestMargin}
          initialScrollToLatest={initialScrollToLatest}
          onScroll={onScroll}
          onZoom={handleZoom}
          onViewportChange={onViewportChange}
          userViewportCallbackMode={userViewportCallbackMode}
          userViewportCallbackDebounceMs={userViewportCallbackDebounceMs}
          enableScroll={effectiveEnableScroll}
          enableZoom={effectiveEnableZoom}
          scaleSmoothing={scaleSmoothingConfig}
          layerRegistry={layerRegistry}
          drawingRegistry={drawingRegistry}
          onDrawingHover={onDrawingHover}
          onDrawingClick={onDrawingClick}
          onLayerHover={onLayerHover}
          onLayerClick={onLayerClick}
          minimal={isMinimal}
        />
      }
    </div>
  );

});

const MemoizedChart = memo(Chart) as typeof Chart;

export default MemoizedChart;
export type { ChartCallbackInfo, ChartHandle, ChartViewport, ChartViewportCallbackMode } from './ChartHandle';
