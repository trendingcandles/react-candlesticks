import { Area, Chart, Panel, exampleData } from '../../lib';

function AreaChart() {

  return (
    <Chart
      data={exampleData}
      theme='dark'
      initialScrollToLatest
    >
      <Panel>
        <Area
          series={{
            value: {
              line: {
                color: '#38bdf8',
                width: 2,
                endDotSize: 5,
              },
              fill: {
                topColor: '#38bdf855',
                bottomColor: 'transparent',
              },
            },
          }}
          markers={{
            value: {
              line: { color: '#38bdf8' },
              label: {
                backgroundColor: '#38bdf8',
                borderColor: '#38bdf8',
                color: '#082f49',
              },
            },
          }}
        />
      </Panel>
    </Chart>
  );
}

export default AreaChart;
