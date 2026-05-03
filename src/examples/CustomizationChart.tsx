import { Candlesticks, Chart, Panel, RSI, exampleData } from '../../lib';

function CustomizationChart() {

  return (
    <Chart
      data={exampleData}
    >
      <Panel heightRatio={3}>
        <Candlesticks
          series={{
            body: {
              up: {
                backgroundColor: 'dodgerblue',
                borderWidth: 0
              },
              down: {
                backgroundColor: 'white',
                borderColor: 'dodgerblue',
                borderWidth: 1
              },
            },
            wick: {
              up:   { color: 'dodgerblue' },
              down: { color: 'dodgerblue' },
            },
          }}
          yAxis={{
            labels: { fontWeight: '900', color: 'dodgerblue' },
          }}
        />
      </Panel>
      <Panel>
        <RSI
          series={{ value: { color: 'orangered' } }}
          markers={{ value: { label: { color: 'white' } } }}
        />
      </Panel>
    </Chart>
  );
}

export default CustomizationChart;
