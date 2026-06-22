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
          markers={{
            value: {
              up: {
                label: {
                  backgroundColor: 'white',
                  borderColor: 'dodgerblue',
                  borderRadius: 6,
                  borderWidth: 1,
                  color: 'dodgerblue',
                },
              },
              down: {
                label: {
                  backgroundColor: 'white',
                  borderColor: 'dodgerblue',
                  borderRadius: 6,
                  borderWidth: 1,
                  color: 'dodgerblue',
                },
              },
              flat: {
                label: {
                  backgroundColor: 'white',
                  borderColor: 'dodgerblue',
                  borderRadius: 6,
                  borderWidth: 1,
                  color: 'dodgerblue',
                },
              },
            },
          }}
        />
      </Panel>
      <Panel>
        <RSI
          series={{ value: { color: 'orangered' } }}
          markers={{
            value: {
              label: {
                backgroundColor: 'orangered',
                borderColor: 'orangered',
                borderRadius: 6,
                borderWidth: 1,
                color: 'white',
              },
            },
          }}
        />
      </Panel>
    </Chart>
  );
}

export default CustomizationChart;
