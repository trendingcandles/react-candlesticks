import { Candlesticks, Chart, Panel, exampleData } from '../../lib';

function SimpleChart() {

  return (
    <Chart
      data={exampleData}
      theme='dark'
      initialScrollToLatest
    >
      <Panel>
        <Candlesticks/>
      </Panel>
    </Chart>
  );
}

export default SimpleChart;
