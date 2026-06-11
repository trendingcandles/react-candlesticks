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

function FullConfigurationChart() {

  return (
    <Chart
      data={exampleData}
      theme='dark'
    >
      <Panel heightRatio={3}>
        <Candlesticks/>
        <SMA
          period={50}
          series={{ value: { endDotSize: 5 } }}
        />
        <BollingerBands
          series={{
            upper: { endDotSize: 5 },
            middle: { endDotSize: 5 },
            lower: { endDotSize: 5 },
          }}
        />
      </Panel>
      <Panel>
        <VolumeBars/>
      </Panel>
      <Panel>
        <Stochastic
          id="stoch-14-3-3"
          kPeriod={14}
          kSmoothing={3}
          dPeriod={3}
          valueGridLines={[20, 80]}
          inputs={[
            { key: 'high', source: { type: 'price', field: 'high' } },
            { key: 'low', source: { type: 'price', field: 'low' } },
            { key: 'close', source: { type: 'price', field: 'close' } },
          ]}
          outputs={['k', 'kSmoothed', 'd']}
          lookback={(period) => period * 2}
          calculate={true}
          includeInAutoScale={true}
          series={{
            k: { color: '#ccc', width: 1, style: 'solid', endDotSize: 5 },
            d: { color: '#ef4444', width: 1, style: 'solid', endDotSize: 5 },
          }}
          markers={{
            k: {
              mode: 'last-visible',
              line: {},
              label: { backgroundColor: '#777', color: 'white' },
            },
            d: {
              mode: 'last-visible',
              line: { color: '#ef4444', width: 1, style: 'dashed', dashes: [5, 5] },
              label: { backgroundColor: '#ef4444', color: 'white' },
            },
          }}
          legend={{
            label: 'Stochastic 14 3 3',
            fields: [
              { output: 'k', label: '', color: '#ccc' },
              { output: 'd', label: '', color: '#ef4444' },
            ],
          }}
          yAxis={{ side: 'right', width: 80 }}
          valueLabelFormatter={(value: number) => `${value}x`}
        />
      </Panel>
    </Chart>
  );
}

export default FullConfigurationChart;
