import { Candlesticks, Chart, Panel, exampleData } from '../../lib';

function NonInteractiveChart() {

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
      enableScroll={false}
      enableZoom={false}
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

export default NonInteractiveChart;
