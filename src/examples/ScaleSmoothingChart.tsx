import { useMemo, useState } from 'react';
import {
  BollingerBands,
  Candlesticks,
  Chart,
  Panel,
  RSI,
  SMA,
  ScaleSmoothingInput,
  VolumeBars,
  exampleData,
} from '../../lib';

const smoothingModes = [
  {
    key: 'off',
    label: 'Off',
    value: false,
  },
  {
    key: 'balanced',
    label: 'Balanced',
    value: true,
  },
  {
    key: 'slow',
    label: 'Slow',
    value: { durationMs: 320 },
  },
  {
    key: 'full',
    label: 'Full',
    value: { durationMs: 260, expandImmediate: false },
  },
] as const satisfies readonly {
  key: string;
  label: string;
  value: ScaleSmoothingInput;
}[];

type SmoothingModeKey = typeof smoothingModes[number]['key'];

function ScaleSmoothingChart() {
  const [smoothingMode, setSmoothingMode] = useState<SmoothingModeKey>('balanced');
  const scaleSmoothing = useMemo(
    () => smoothingModes.find(mode => mode.key === smoothingMode)?.value ?? false,
    [smoothingMode],
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div
        role="group"
        aria-label="Scale smoothing"
        style={{
          display: 'inline-flex',
          alignSelf: 'flex-start',
          backgroundColor: '#20242a',
          border: '1px solid #3b4652',
          borderRadius: 6,
          overflow: 'hidden',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {smoothingModes.map((mode) => {
          const active = smoothingMode === mode.key;

          return (
            <button
              key={mode.key}
              type="button"
              onClick={() => setSmoothingMode(mode.key)}
              aria-pressed={active}
              style={{
                minWidth: 92,
                height: 34,
                border: 0,
                borderRight: mode.key === smoothingModes[smoothingModes.length - 1].key ? 0 : '1px solid #3b4652',
                backgroundColor: active ? '#d6e4ff' : 'transparent',
                color: active ? '#111827' : '#d7dee8',
                font: 'inherit',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              {mode.label}
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Chart
          data={exampleData}
          theme="dark"
          initialScrollToLatest
          scaleSmoothing={scaleSmoothing}
        >
          <Panel heightRatio={3}>
            <Candlesticks />
            <SMA period={30} />
            <BollingerBands />
          </Panel>
          <Panel>
            <VolumeBars />
          </Panel>
          <Panel>
            <RSI />
          </Panel>
        </Chart>
      </div>
    </div>
  );
}

export default ScaleSmoothingChart;
