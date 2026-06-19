import { useState } from 'react';
import {
  Candlesticks,
  Chart,
  DrawingConfig,
  DrawingConfigComplete,
  DrawingDragContext,
  DrawingHit,
  Panel,
  defineDrawing,
  exampleData,
} from '../../lib';

interface PriceSegmentConfig extends DrawingConfig {
  type: 'custom:price-segment';
  startIndex: number;
  startValue: number;
  endIndex: number;
  endValue: number;
  color?: string;
  lineWidth?: number;
  onSegmentHover?: (hit: DrawingHit | null) => void;
  onSegmentClick?: (hit: DrawingHit) => void;
  onSegmentDrag?: (drag: DrawingDragContext<PriceSegmentConfigComplete>) => void;
}

interface PriceSegmentConfigComplete extends DrawingConfigComplete {
  type: 'custom:price-segment';
  startIndex: number;
  startValue: number;
  endIndex: number;
  endValue: number;
  color: string;
  lineWidth: number;
  onSegmentHover?: (hit: DrawingHit | null) => void;
  onSegmentClick?: (hit: DrawingHit) => void;
  onSegmentDrag?: (drag: DrawingDragContext<PriceSegmentConfigComplete>) => void;
}

interface PriceSegmentDragData {
  point?: 'start' | 'end';
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
    xForIndex,
    valueToY,
  }) => {
    const x1 = xForIndex(drawingConfig.startIndex);
    const x2 = xForIndex(drawingConfig.endIndex);
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
    context.fillStyle = drawingConfig.color;
    context.beginPath();
    context.arc(x1, y1, 4, 0, Math.PI * 2);
    context.arc(x2, y2, 4, 0, Math.PI * 2);
    context.fill();
    context.restore();
  },
  hitTest: ({
    drawingConfig,
    pointer,
    xForIndex,
    valueToY,
  }) => {
    const x1 = xForIndex(drawingConfig.startIndex);
    const x2 = xForIndex(drawingConfig.endIndex);
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

    const startDistancePx = Math.hypot(pointer.panelX - x1, pointer.chartY - y1);
    if (startDistancePx <= 8) {
      return {
        target: 'vertex',
        cursor: 'grab',
        data: { point: 'start' },
      };
    }

    const endDistancePx = Math.hypot(pointer.panelX - x2, pointer.chartY - y2);
    if (endDistancePx <= 8) {
      return {
        target: 'vertex',
        cursor: 'grab',
        data: { point: 'end' },
      };
    }

    const distancePx = distanceToSegment(pointer.panelX, pointer.chartY, x1, y1, x2, y2);
    if (distancePx > drawingConfig.lineWidth + 6) return null;

    return {
      target: 'body',
      cursor: 'grab',
      data: { distancePx },
    };
  },
  onHover: (hit, { drawingConfig }) => {
    drawingConfig.onSegmentHover?.(hit);
  },
  onClick: (hit, { drawingConfig }) => {
    drawingConfig.onSegmentClick?.(hit);
  },
  onDrag: (drag) => {
    drag.drawingConfig.onSegmentDrag?.(drag);
  },
});

const PriceSegment = priceSegmentDrawing.Component;

function CustomDrawingChart() {
  const [hovered, setHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [segment, setSegment] = useState(() => {
    const startIndex = exampleData.length - 35;
    const endIndex = exampleData.length - 15;

    return {
      startIndex,
      startValue: exampleData[startIndex].low + 42,
      endIndex,
      endValue: exampleData[endIndex].low - 50,
    };
  });

  const handleSegmentDrag = (drag: DrawingDragContext<PriceSegmentConfigComplete>) => {
    const startConfig = drag.start.drawingConfig;
    const deltaIndex = drag.delta.index ?? 0;
    const deltaValue = drag.delta.value ?? 0;
    const dragData = drag.hit.data as PriceSegmentDragData | undefined;

    setSegment({
      startIndex: dragData?.point === 'end' ? startConfig.startIndex : startConfig.startIndex + deltaIndex,
      startValue: dragData?.point === 'end' ? startConfig.startValue : startConfig.startValue + deltaValue,
      endIndex: dragData?.point === 'start' ? startConfig.endIndex : startConfig.endIndex + deltaIndex,
      endValue: dragData?.point === 'start' ? startConfig.endValue : startConfig.endValue + deltaValue,
    });
  };

  return (
    <>
      <Chart
        data={exampleData}
        theme="dark"
        drawingDefinitions={[priceSegmentDrawing]}
        initialScrollToLatest
      >
        <Panel>
          <Candlesticks />
          <PriceSegment
            startIndex={segment.startIndex}
            startValue={segment.startValue}
            endIndex={segment.endIndex}
            endValue={segment.endValue}
            color={hovered ? '#fbbf24' : '#f59e0b'}
            lineWidth={hovered ? 4 : 2}
            onSegmentHover={(hit: DrawingHit | null) => setHovered(hit !== null)}
            onSegmentClick={() => setClickCount((count) => count + 1)}
            onSegmentDrag={handleSegmentDrag}
          />
        </Panel>
      </Chart>
      <p style={{ color: '#e5e7eb', fontFamily: 'sans-serif' }}>
        Hover the orange segment, click it, or drag the line/body endpoints. Clicks: {clickCount}
      </p>
    </>
  );
}

export default CustomDrawingChart;
