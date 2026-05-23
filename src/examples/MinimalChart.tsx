import { Candlesticks, Chart, Panel, exampleData } from '../../lib';

function MinimalChart() {

  return (
    <Chart
      width={400}
      height={300}
      data={exampleData}
      theme="dark"
      initialScrollToLatest
      xAxis={false}
      crosshairs={false}
      grid={false}
    >
      <Panel>
        <Candlesticks
          yAxis={false}
          legend={false}
        />
      </Panel>
    </Chart>
  );
}

export default MinimalChart;
