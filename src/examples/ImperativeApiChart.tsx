import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Candlesticks,
  Chart,
  ChartHandle,
  ChartViewport,
  Panel,
  SMA,
  VolumeBars,
  exampleData,
} from '../../lib';

function ImperativeApiChart() {
  const chartRef = useRef<ChartHandle>(null);
  const [viewport, setViewport] = useState<ChartViewport | null>(null);

  const highlightedIndex = Math.floor(exampleData.length * 0.72);
  const highlightedPoint = useMemo(() => exampleData[highlightedIndex], [highlightedIndex]);

  const rangeStart = Math.max(0, exampleData.length - 120);
  const rangeEnd = Math.max(rangeStart, exampleData.length - 45);
  const targetRangeStart = Math.max(0, highlightedIndex - 42);
  const targetRangeEnd = Math.min(exampleData.length - 1, highlightedIndex + 42);

  useEffect(() => {
    chartRef.current?.setVisibleRange({
      from: rangeStart,
      to: rangeEnd,
      marginBars: 6,
    });
  }, [rangeEnd, rangeStart]);

  const showTargetCrosshair = (lock = false) => {
    chartRef.current?.setVisibleRange({
      from: targetRangeStart,
      to: targetRangeEnd,
      marginBars: 6,
    });

    requestAnimationFrame(() => {
      chartRef.current?.setCrosshairPosition({
        barIndex: highlightedIndex,
        value: highlightedPoint.close,
        panelId: 'price',
      }, { lock });
    });
  };

  const controls = [
    {
      label: 'Range',
      onClick: () => chartRef.current?.setVisibleRange({
        from: rangeStart,
        to: rangeEnd,
        marginBars: 6,
      }),
    },
    {
      label: 'Fit',
      onClick: () => chartRef.current?.fitContent({ marginBars: 8 }),
    },
    {
      label: 'Latest',
      onClick: () => chartRef.current?.scrollToLatest({ marginBars: 8 }),
    },
    {
      label: 'Left',
      onClick: () => {
        const current = chartRef.current?.getViewport();
        chartRef.current?.setScrollPosition((current?.scrollOffset ?? 0) - 240);
      },
    },
    {
      label: 'Right',
      onClick: () => {
        const current = chartRef.current?.getViewport();
        chartRef.current?.setScrollPosition((current?.scrollOffset ?? 0) + 240);
      },
    },
    {
      label: 'Show mark',
      onClick: () => showTargetCrosshair(),
    },
    {
      label: 'Pin mark',
      onClick: () => showTargetCrosshair(true),
    },
    {
      label: 'Clear',
      onClick: () => chartRef.current?.clearCrosshairPosition(),
    },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          role="group"
          aria-label="Imperative chart controls"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          {controls.map((control) => (
            <button
              key={control.label}
              type="button"
              onClick={control.onClick}
              style={{
                height: 34,
                minWidth: 76,
                border: '1px solid #3b4652',
                borderRadius: 6,
                backgroundColor: '#20242a',
                color: '#d7dee8',
                font: 'inherit',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              {control.label}
            </button>
          ))}
        </div>
        <div
          aria-live="polite"
          style={{
            minWidth: 300,
            color: '#d7dee8',
            fontSize: 13,
            fontFamily: 'Menlo, Consolas, monospace',
            textAlign: 'right',
          }}
        >
          <div>
            {viewport
              ? `offset ${viewport.scrollOffset} | width ${viewport.intervalWidthPx.toFixed(1)} | bars ${viewport.startBarIndex}-${viewport.endBarIndex} | ${viewport.source}`
              : 'viewport pending'}
          </div>
          <div style={{ color: '#9fb0c3', marginTop: 4 }}>
            mark {highlightedIndex} | close {highlightedPoint.close.toFixed(2)}
          </div>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Chart
          ref={chartRef}
          data={exampleData}
          theme="dark"
          onViewportChange={setViewport}
          userViewportCallbackMode="debounce"
          userViewportCallbackDebounceMs={120}
        >
          <Panel id="price" heightRatio={3}>
            <Candlesticks />
            <SMA period={30} />
          </Panel>
          <Panel id="volume">
            <VolumeBars />
          </Panel>
        </Chart>
      </div>
    </div>
  );
}

export default ImperativeApiChart;
