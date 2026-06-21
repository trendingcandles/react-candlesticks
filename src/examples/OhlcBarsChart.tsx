import { Chart, OhlcBars, Panel, exampleData } from '../../lib';

function OhlcBarsChart() {

  return (
    <Chart
      data={exampleData}
      theme='dark'
      initialScrollToLatest
    >
      <Panel>
        <OhlcBars
          series={{
            bars: {
              up: {
                backgroundColor: '#22c55e',
                borderColor: '#22c55e',
              },
              down: {
                backgroundColor: '#f43f5e',
                borderColor: '#f43f5e',
              },
              flat: {
                backgroundColor: '#94a3b8',
                borderColor: '#94a3b8',
              },
            },
          }}
        />
      </Panel>
    </Chart>
  );
}

export default OhlcBarsChart;
