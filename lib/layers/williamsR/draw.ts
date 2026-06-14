import { ChartConfigComplete } from '../../config/chart/ChartConfig';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import { Layout } from '../../domain/types/Layout';
import { ChartMetrics } from '../../domain/types/metrics/ChartMetrics';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import ViewportData from '../../domain/types/ViewportData';
import drawLineIndicator from '../../drawing/layer/drawLineIndicator';
import { WilliamsRLayerConfigComplete } from './WilliamsRLayerConfig';

const draw = (
  context: CanvasRenderingContext2D,
  axesContext: CanvasRenderingContext2D,
  chartConfig: ChartConfigComplete,
  panelConfig: PanelConfigComplete,
  layerConfig: WilliamsRLayerConfigComplete,
  layout: Layout,
  viewportData: ViewportData,
  chartMetrics: ChartMetrics | null,
  panelMetrics: PanelMetrics | null,
  layerMetrics: LayerMetrics | null,
) => {
  const config = layerConfig;
  drawLineIndicator(context, axesContext, chartConfig, panelConfig, layerConfig, layout, viewportData, chartMetrics, panelMetrics, layerMetrics, [
    { output: 'value', line: config.series.value, marker: config.markers.value },
  ]);
};

export default draw;
