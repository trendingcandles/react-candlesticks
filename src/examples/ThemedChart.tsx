import {
  BollingerBands,
  Candlesticks,
  Chart,
  MACD,
  Panel,
  RSI,
  SMA,
  Theme,
  VolumeBars,
  exampleData,
} from '../../lib';

const customTheme: Theme = {
  base: 'dark',
  chart: {
    backgroundColor: '#101820',
    grid: {
      time: { color: '#243443' },
      value: { color: '#243443' },
    },
    crosshairs: {
      time: {
        line: { color: '#d5dde7' },
        label: {
          backgroundColor: '#d5dde7',
          borderColor: '#d5dde7',
          color: '#101820',
        },
      },
      value: {
        line: { color: '#d5dde7' },
        label: {
          backgroundColor: '#d5dde7',
          borderColor: '#d5dde7',
          color: '#101820',
        },
      },
    },
  },
  panels: {
    borderTop: { color: '#304759' },
  },
  indicators: {
    line: { width: 2 },
    linePalette: ['#ffd166', '#5dd9c1', '#c77dff'],
    positiveColor: '#35c46b',
    negativeColor: '#ff5a5f',
    marker: {
      label: {
        hPadding: 10,
        vPadding: 6,
        color: '#000000'
      },
    },
    legend: {
      backgroundColor: '#101820cc',
      color: '#e6edf3',
    },
    yAxis: {
      labels: { color: '#d5dde7' },
      border: { color: '#304759' },
    },
  },
  layers: {
    candlesticks: {
      series: {
        body: {
          up: { backgroundColor: '#35c46b', borderColor: '#35c46b' },
          down: { backgroundColor: '#ff5a5f', borderColor: '#ff5a5f' },
          flat: { backgroundColor: '#d5dde7', borderColor: '#d5dde7' },
        },
        wick: {
          up: { color: '#35c46b' },
          down: { color: '#ff5a5f' },
          flat: { color: '#d5dde7' },
        },
      },
    },
    volumeBars: {
      series: {
        bars: {
          up: { backgroundColor: '#35c46b66', borderColor: '#35c46b66' },
          down: { backgroundColor: '#ff5a5f66', borderColor: '#ff5a5f66' },
        },
      },
    },
    sma: {
      series: {
        value: { color: '#ffd166', width: 3 },
      },
    },
  },
};

function ThemedChart() {
  return (
    <Chart data={exampleData} theme={customTheme}>
      <Panel heightRatio={3}>
        <Candlesticks />
        <SMA period={30} />
        <BollingerBands />
      </Panel>
      <Panel>
        <VolumeBars />
      </Panel>
      <Panel>
        <RSI />
      </Panel>
      <Panel>
        <MACD />
      </Panel>
    </Chart>
  );
}

export default ThemedChart;
