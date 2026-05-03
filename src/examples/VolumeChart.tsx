import { Candlesticks, Chart, Panel, VolumeBars, exampleData } from '../../lib';

function VolumeChart() {

  return (
    <Chart
      data={exampleData}
      theme='dark'
    >
      <Panel heightRatio={3}>
        <Candlesticks/>
      </Panel>
      <Panel>
        <VolumeBars/>
      </Panel>
    </Chart>
  );
}

export default VolumeChart;
