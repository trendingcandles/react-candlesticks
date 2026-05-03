/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../../config/chart/ChartConfig';
import { LayerConfigComplete } from '../../../config/layer/LayerConfig';
import { PanelConfigComplete } from '../../../config/panel/PanelConfig';
import { Layout } from '../../../domain/types/Layout';
import { PanelMetrics } from '../../../domain/types/metrics/PanelMetrics';
import { ValueGridLine } from '../../chart/grid/value/ValueGridLine';
import { PanelYAxis } from '../../panel/getPanelYAxes';

const drawValueGridLabels = (
  context: CanvasRenderingContext2D,
  layout: Layout,
  chartConfig: ChartConfigComplete,
  panelConfig: PanelConfigComplete,
  layerConfig: LayerConfigComplete,
  valueGridLines: ValueGridLine[],
  panelMetrics: PanelMetrics,
  panelYAxis: PanelYAxis,
) => {

  const {
    offsetPx,
  } = panelYAxis;

  const {
    drawingAreaX,
    drawingAreaX1,
  } = layout;

  const { yAxis, valueLabelFormatter } = layerConfig;

  if (!yAxis) return;

  const {
    side = 'right',
    width: yAxisWidth,
    labels: labelConfig
  } = yAxis;

  if (!labelConfig) return null;

  const {
    color,
    fontFamily,
    fontSize,
    fontWeight,
    fontVariant,
    fontStyle,
    padding,
  } = labelConfig;

  const {
    topPx,
    bottomPx,
  } = panelMetrics;

  let labelX;

  if (side === 'left') {
    labelX = (drawingAreaX - offsetPx) - yAxisWidth + padding;
  } else {
    labelX = drawingAreaX1 + offsetPx + padding;
  }

  context.fillStyle = color;
  context.font =`${fontStyle} ${fontVariant} ${fontWeight} ${fontSize}px ${fontFamily}`;
  context.textBaseline = 'middle';
  context.textAlign = 'left'; 

  for (let lineIndex = 0; lineIndex < valueGridLines.length; lineIndex++) {
    const { value, y } = valueGridLines[lineIndex];

    if (y > fontSize && y > topPx && y < bottomPx) { // avoid label text being cut off by top edge of canvas
      const formattedText = valueLabelFormatter(value);
      context.fillText(formattedText, labelX, y);
    }
  }

};

export default drawValueGridLabels;
