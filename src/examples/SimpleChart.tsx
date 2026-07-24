import { Candlesticks, Chart, Panel, exampleData } from '../../lib';

function SimpleChart() {

  return (
    <Chart
      data={exampleData}
      theme='dark'
      initialScrollToLatest
      watermark
    >
      <Panel>
        <Candlesticks/>
      </Panel>
    </Chart>
  );
}

export default SimpleChart;
