/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { HTMLAttributes, JSX, memo, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import parseChartConfig from '../../config/chart/parseChartConfig';
import type { DataPoint } from '../../domain/types/DataPoint';
import useResizeObserver from '../../hooks/useResizeObserver';
import useDevicePixelRatio from '../../hooks/useDevicePixelRatio';
import StatefulChart from '../StatefulChart';
import { PanelConfig } from '../../config/panel/PanelConfig';
import parsePanelConfigs from '../../config/panel/parsePanelConfigs';
import { Theme } from '../../domain/types/Theme';
import themes, { ThemeName } from '../../themes/themes';
import { Granularity } from '../../domain/types/Granularity';
import { GridConfig } from '../../config/chart/grid/GridConfig';
import { CrosshairsConfig } from '../../config/chart/crosshairs/CrosshairsConfig';
import parseConfigComponents from './parseConfigComponents';
import { XAxisConfig } from '../../config/chart/xAxis/XAxisConfig';
import setPanelYAxes from '../../config/panel/setPanelYAxes';
import { LayerConfigComplete } from '../../config/layer/LayerConfig';
import { createLayersData } from '../../data/layers/createLayersData';
import getLayout from '../../layout/getLayout';
import createContinuousIndexProvider from '../../indexProviders/continuous/createContinuousIndexProvider';
import deduceGranularity from '../../data/utils/deduceGranulairty';
import createLayerTopology from '../../config/layer/createLayerTopology';
import styles from './styles.module.scss';
import { BordersConfig } from '../../config/chart/borders/BordersConfig';

interface ChartPropsBase extends Omit<HTMLAttributes<HTMLDivElement>, 'onScroll'> {
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
  onScroll?: (newScrollOffset: number) => void; // todo: add source arg: 'mouse' | 'touch' | 'trackpad';
  onZoom?: (newIntervalWidthPx: number) => void;
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

const Chart = ({
  width = 'auto',
  height = 'auto',
  intervalWidthPx = 12,
  granularity,
  backgroundColor,
  xAxis,
  grid,
  crosshairs,
  borders,
  theme = themes.light,
  panels,
  data,
  scrollToLatestMargin = 5,
  initialScrollToLatest = false,
  onScroll,
  onZoom,
  children,
  ...props
}: ChartProps): JSX.Element => {

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
  const [size, ref] = useResizeObserver<HTMLDivElement>(width === 'auto' || height === 'auto');
  const dpr = useDevicePixelRatio();

  const zoomTimeoutRef = useRef<number | null>(null);
  const lastNotifiedZoom = useRef<number>(intervalWidthPx);
  const [ internalIntervalSize, setInternalIntervalSize ] = useState(intervalWidthPx);

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
    return typeof theme === 'string' ? themes[theme as ThemeName] : theme; // todo: validate theme
  }, [theme]);

  // Parse chart config (everything that's not panels/layers)
  const chartConfigComplete = useMemo(() => {
    const chartConfig = {
      backgroundColor,
      xAxis,
      grid,
      crosshairs,
      borders,
    };
    return parseChartConfig(chartConfig, effectiveTheme, defaultTimeZoneId);
  }, [backgroundColor, xAxis, grid, crosshairs, borders, effectiveTheme, defaultTimeZoneId]);

  // Parse panel configs and create layer topology
  const { panelConfigs: panelConfigsComplete, layersTopology } = useMemo(() => {
    const panelConfigsWithoutYAxis = parsePanelConfigs(effectivePanels as readonly[PanelConfig, ...[PanelConfig]], effectiveTheme);
    const layersTopology = createLayerTopology(panelConfigsWithoutYAxis);
    const panelConfigs = setPanelYAxes(panelConfigsWithoutYAxis, layersTopology);
    return {
      panelConfigs,
      layersTopology,
    };
  }, [effectivePanels, effectiveTheme]);

  // Create layout object
  const layout = useMemo(() =>
    getLayout(effectiveWidth, effectiveHeight, dpr, chartConfigComplete, panelConfigsComplete),
    [effectiveWidth, effectiveHeight, dpr, chartConfigComplete, panelConfigsComplete],
  );

  // Deduce max lookback and look forward
  const { maxLookback, maxLookForward } = useMemo(() => {
    const indicatorLayers =  panelConfigsComplete.flatMap(p => (p.layers.filter(l => l.indicator === true) as LayerConfigComplete[]));
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
    return createLayersData(panelConfigsComplete.flatMap(p => p.layers), layersTopology, indexProvider.barsLength);
  }, [panelConfigsComplete, layersTopology, indexProvider.barsLength]);


  useEffect(() => {
    setInternalIntervalSize(intervalWidthPx);
  }, [intervalWidthPx]);

  const handleZoom = useCallback((newIntervalSize: number) => {
    setInternalIntervalSize(newIntervalSize);
    
    if (onZoom) {
      if (zoomTimeoutRef.current !== null) {
        clearTimeout(zoomTimeoutRef.current);
      }
      
      zoomTimeoutRef.current = window.setTimeout(() => {
        const roundedSize = Math.round(newIntervalSize);
        // Only call if it actually changed
        if (roundedSize !== lastNotifiedZoom.current) {
          onZoom(roundedSize);
          lastNotifiedZoom.current = roundedSize;
        }
        zoomTimeoutRef.current = null;
      }, 150);
    }
  }, [onZoom]);

  useEffect(() => {
    return () => {
      if (zoomTimeoutRef.current !== null) {
        clearTimeout(zoomTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
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
          chartWidth={effectiveWidth}
          chartHeight={effectiveHeight}
          intervalSize={internalIntervalSize}
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
        />
      }
    </div>
  );

};

export default memo(Chart);
