import { useState } from 'react';
import {
  Candlesticks,
  Chart,
  LayerHit,
  Panel,
  SMA,
  exampleData,
} from '../../lib';

interface CandleHitData {
  barIndex: number;
  close: number;
}

interface LineHitData {
  output: string;
  barIndex: number;
  value: number;
}

function LayerInteractionChart() {
  const [hoverText, setHoverText] = useState('Hover the SMA line or a candle.');
  const [clickText, setClickText] = useState('No layer click yet.');

  const handleLayerHover = (hit: LayerHit | null) => {
    if (!hit) {
      setHoverText('Hover the SMA line or a candle.');
      return;
    }

    if (hit.target === 'candle-body' || hit.target === 'candle-wick') {
      const data = hit.data as CandleHitData;
      setHoverText(`Hovering candle ${data.barIndex}: close ${data.close.toFixed(2)}`);
      return;
    }

    const data = hit.data as LineHitData;
    setHoverText(`Hovering ${hit.layerType} ${data.output} at bar ${data.barIndex}: ${data.value.toFixed(2)}`);
  };

  return (
    <>
      <Chart
        data={exampleData}
        theme="dark"
        initialScrollToLatest
      >
        <Panel>
          <Candlesticks
            onElementHover={handleLayerHover}
            onElementClick={(hit) => {
              const data = hit.data as CandleHitData;
              setClickText(`Clicked candle ${data.barIndex}: close ${data.close.toFixed(2)}`);
            }}
          />
          <SMA
            period={20}
            series={{
              value: {
                color: '#fbbf24',
                width: 2,
              },
            }}
            onElementHover={handleLayerHover}
            onElementClick={(hit) => {
              const data = hit.data as LineHitData;
              setClickText(`Clicked SMA at bar ${data.barIndex}: ${data.value.toFixed(2)}`);
            }}
          />
        </Panel>
      </Chart>
      <p style={{ color: '#e5e7eb', fontFamily: 'sans-serif' }}>
        {hoverText}
      </p>
      <p style={{ color: '#e5e7eb', fontFamily: 'sans-serif' }}>
        {clickText}
      </p>
    </>
  );
}

export default LayerInteractionChart;
