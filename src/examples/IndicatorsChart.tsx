import {
  BollingerBands,
  Candlesticks,
  Chart,
  Panel,
  SMA,
  Stochastic,
  VolumeBars,
  exampleData
} from '../../lib';

function IndicatorsChart() {

  return (
    <Chart
      data={exampleData}
      theme='dark'
    >
      <Panel heightRatio={3}>
        <Candlesticks/>
        <SMA period={30}/>
        <BollingerBands/>
      </Panel>
      <Panel>
        <VolumeBars/>
      </Panel>
      <Panel>
        <Stochastic/>
      </Panel>
    </Chart>
  );
}

export default IndicatorsChart;
