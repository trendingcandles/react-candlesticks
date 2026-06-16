import {
  Candlesticks,
  Chart,
  DrawingConfig,
  DrawingConfigComplete,
  Panel,
  defineDrawing,
  exampleData,
} from '../../lib';

interface PriceSegmentConfig extends DrawingConfig {
  type: 'custom:price-segment';
  startTimestamp: number;
  startValue: number;
  endTimestamp: number;
  endValue: number;
  color?: string;
  lineWidth?: number;
}

interface PriceSegmentConfigComplete extends DrawingConfigComplete {
  type: 'custom:price-segment';
  startTimestamp: number;
  startValue: number;
  endTimestamp: number;
  endValue: number;
  color: string;
  lineWidth: number;
}

const priceSegmentDrawing = defineDrawing<PriceSegmentConfig, PriceSegmentConfigComplete>({
  type: 'custom:price-segment',
  displayName: 'PriceSegment',
  parseConfig: (config, panelId, drawingIndex) => ({
    ...config,
    id: config.id ?? `price-segment_${panelId}_${drawingIndex}`,
    type: 'custom:price-segment',
    visible: config.visible ?? true,
    color: config.color ?? '#f59e0b',
    lineWidth: config.lineWidth ?? 2,
  }),
  draw: ({
    context,
    drawingConfig,
    xForTimestamp,
    valueToY,
  }) => {
    const x1 = xForTimestamp(drawingConfig.startTimestamp);
    const x2 = xForTimestamp(drawingConfig.endTimestamp);
    const y1 = valueToY(drawingConfig.startValue);
    const y2 = valueToY(drawingConfig.endValue);

    if (
      x1 === undefined ||
      x2 === undefined ||
      y1 === undefined ||
      y2 === undefined
    ) {
      return;
    }

    context.save();
    context.strokeStyle = drawingConfig.color;
    context.lineWidth = drawingConfig.lineWidth;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.restore();
  },
});

const PriceSegment = priceSegmentDrawing.Component;

function CustomDrawingChart() {
  const start = exampleData[exampleData.length - 35];
  const end = exampleData[exampleData.length - 15];

  return (
    <Chart
      data={exampleData}
      theme="dark"
      customDrawings={[priceSegmentDrawing]}
      initialScrollToLatest
    >
      <Panel>
        <Candlesticks />
        <PriceSegment
          startTimestamp={Date.parse(start.time)}
          startValue={start.low}
          endTimestamp={Date.parse(end.time)}
          endValue={end.high}
          color="#f59e0b"
          lineWidth={2}
        />
      </Panel>
    </Chart>
  );
}

export default CustomDrawingChart;
