import { useState } from 'react';
import {
  Candlesticks,
  Chart,
  DrawingConfig,
  DrawingConfigComplete,
  DrawingHit,
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
  onSegmentHover?: (hit: DrawingHit | null) => void;
  onSegmentClick?: (hit: DrawingHit) => void;
}

interface PriceSegmentConfigComplete extends DrawingConfigComplete {
  type: 'custom:price-segment';
  startTimestamp: number;
  startValue: number;
  endTimestamp: number;
  endValue: number;
  color: string;
  lineWidth: number;
  onSegmentHover?: (hit: DrawingHit | null) => void;
  onSegmentClick?: (hit: DrawingHit) => void;
}

const distanceToSegment = (
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    return Math.hypot(x - x1, y - y1);
  }

  const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / lengthSquared));
  const closestX = x1 + t * dx;
  const closestY = y1 + t * dy;

  return Math.hypot(x - closestX, y - closestY);
};

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
  hitTest: ({
    drawingConfig,
    pointer,
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
      return null;
    }

    const distancePx = distanceToSegment(pointer.panelX, pointer.chartY, x1, y1, x2, y2);
    if (distancePx > drawingConfig.lineWidth + 6) return null;

    return {
      target: 'segment',
      cursor: 'pointer',
      data: { distancePx },
    };
  },
  onHover: (hit, { drawingConfig }) => {
    drawingConfig.onSegmentHover?.(hit);
  },
  onClick: (hit, { drawingConfig }) => {
    drawingConfig.onSegmentClick?.(hit);
  },
});

const PriceSegment = priceSegmentDrawing.Component;

function CustomDrawingChart() {
  const [hovered, setHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const start = exampleData[exampleData.length - 35];
  const end = exampleData[exampleData.length - 15];

  return (
    <>
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
            startValue={start.low + 42}
            endTimestamp={Date.parse(end.time)}
            endValue={end.low - 50}
            color={hovered ? '#fbbf24' : '#f59e0b'}
            lineWidth={hovered ? 4 : 2}
            onSegmentHover={(hit: DrawingHit | null) => setHovered(hit !== null)}
            onSegmentClick={() => setClickCount((count) => count + 1)}
          />
        </Panel>
      </Chart>
      <p style={{ color: '#e5e7eb', fontFamily: 'sans-serif' }}>
        Hover the orange segment, then click it. Clicks: {clickCount}
      </p>
    </>
  );
}

export default CustomDrawingChart;
