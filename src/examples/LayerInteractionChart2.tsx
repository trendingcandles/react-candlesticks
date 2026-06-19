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

function LayerInteractionChart2() {
  const [hoverText, setHoverText] = useState('Hover the SMA line or a candle.');
  const [clickText, setClickText] = useState('No chart-level layer click yet.');

  const handleLayerHover = (hit: LayerHit | null) => {
    if (!hit) {
      setHoverText('Hover the SMA line or a candle.');
      return;
    }

    if (hit.target === 'candle-body' || hit.target === 'candle-wick') {
      const data = hit.data as CandleHitData;
      setHoverText(`Chart hover: candle ${data.barIndex}, close ${data.close.toFixed(2)}`);
      return;
    }

    const data = hit.data as LineHitData;
    setHoverText(`Chart hover: ${hit.layerType} ${data.output} at bar ${data.barIndex}, ${data.value.toFixed(2)}`);
  };

  const handleLayerClick = (hit: LayerHit) => {
    if (hit.target === 'candle-body' || hit.target === 'candle-wick') {
      const data = hit.data as CandleHitData;
      setClickText(`Chart click: candle ${data.barIndex}, close ${data.close.toFixed(2)}`);
      return;
    }

    const data = hit.data as LineHitData;
    setClickText(`Chart click: ${hit.layerType} ${data.output} at bar ${data.barIndex}, ${data.value.toFixed(2)}`);
  };

  return (
    <>
      <Chart
        data={exampleData}
        theme="dark"
        initialScrollToLatest
        onLayerHover={handleLayerHover}
        onLayerClick={handleLayerClick}
      >
        <Panel>
          <Candlesticks />
          <SMA
            period={20}
            series={{
              value: {
                color: '#fbbf24',
                width: 2,
              },
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

export default LayerInteractionChart2;
