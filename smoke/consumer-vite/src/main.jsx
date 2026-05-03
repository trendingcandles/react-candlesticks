import React from 'react';
import ReactDOM from 'react-dom/client';
import 'react-candlesticks/style.css';
import {
  Chart,
  Panel,
  Candlesticks,
  VolumeBars,
  exampleData,
} from 'react-candlesticks';
import { Chart as PropTypesChart } from 'react-candlesticks/propTypes';

void PropTypesChart;

function App() {
  return (
    <div style={{ width: '900px', height: '540px' }}>
      <Chart width="auto" height="auto" data={exampleData} granularity="d1">
        <Panel heightRatio={3}>
          <Candlesticks />
        </Panel>
        <Panel>
          <VolumeBars />
        </Panel>
      </Chart>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
