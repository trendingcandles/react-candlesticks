import {
  CCI,
  Candlesticks,
  Chart,
  OBV,
  Panel,
  ParabolicSAR,
  WilliamsR,
  exampleData,
} from '../../lib';

function Indcators2Chart() {
  return (
    <Chart data={exampleData} theme="dark">
      <Panel heightRatio={3}>
        <Candlesticks />
        <ParabolicSAR />
      </Panel>
      <Panel>
        <OBV />
      </Panel>
      <Panel>
        <CCI />
      </Panel>
      <Panel>
        <WilliamsR />
      </Panel>
    </Chart>
  );
}

export default Indcators2Chart;
