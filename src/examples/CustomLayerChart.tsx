import {
  Candlesticks,
  Chart,
  CustomLayerConfig,
  CustomLayerConfigComplete,
  LineConfig,
  LineConfigComplete,
  Panel,
  defineLayer,
  drawLineIndicator,
  exampleData,
  parseLineConfig,
} from '../../lib';

interface TypicalPriceConfig extends CustomLayerConfig {
  type: 'custom:typical-price';
  series?: {
    value?: false | LineConfig;
  };
}

interface TypicalPriceConfigComplete extends CustomLayerConfigComplete {
  type: 'custom:typical-price';
  series: {
    value: null | LineConfigComplete;
  };
}

const typicalPriceLayer = defineLayer<TypicalPriceConfig, TypicalPriceConfigComplete>({
  type: 'custom:typical-price',
  displayName: 'TypicalPrice',
  parseConfig: (config, _theme, panelId) => ({
    id: config.id ?? `typical-price_${panelId}`,
    type: 'custom:typical-price',
    indicator: true,
    defaultScale: { key: 'price_auto', domain: 'price', range: { type: 'auto' } },
    scale: config.scale ?? null,
    scalePolicy: 'derived',
    requiredInputKeys: ['high', 'low', 'close'],
    inputs: config.inputs ?? [
      { key: 'high', source: { type: 'price', field: 'high' } },
      { key: 'low', source: { type: 'price', field: 'low' } },
      { key: 'close', source: { type: 'price', field: 'close' } },
    ],
    outputs: ['value'],
    period: 1,
    offset: 0,
    lookback: 0,
    calculate: config.calculate ?? true,
    includeInAutoScale: config.includeInAutoScale ?? false,
    valueToY: (min, max, top, height) =>
      value => top + ((max - value) / (max - min)) * height,
    legend: null,
    yAxis: null,
    valueLabelFormatter: config.valueLabelFormatter ?? (value => value.toFixed(2)),
    series: {
      value: parseLineConfig(config.series?.value, undefined, '#a78bfa'),
    },
  }),
  calculate: (_config, inputs, outputs, startBarIndex, endBarIndex) => {
    for (let barIndex = startBarIndex; barIndex < endBarIndex; barIndex++) {
      outputs.value[barIndex] = (
        inputs.high.values[barIndex]
        + inputs.low.values[barIndex]
        + inputs.close.values[barIndex]
      ) / 3;
    }
  },
  draw: (
    context,
    axesContext,
    chartConfig,
    panelConfig,
    layerConfig,
    layout,
    viewportData,
    chartMetrics,
    panelMetrics,
    layerMetrics,
  ) => {
    drawLineIndicator(
      context,
      axesContext,
      chartConfig,
      panelConfig,
      layerConfig,
      layout,
      viewportData,
      chartMetrics,
      panelMetrics,
      layerMetrics,
      [{
        output: 'value',
        line: layerConfig.series.value,
        marker: null,
      }],
    );
  },
});

const TypicalPrice = typicalPriceLayer.Component;

function CustomLayerChart() {
  return (
    <Chart
      data={exampleData}
      theme='dark'
      layerDefinitions={[typicalPriceLayer]}
      initialScrollToLatest
    >
      <Panel>
        <Candlesticks/>
        <TypicalPrice
          series={{
            value: {
              color: '#a78bfa',
              width: 2,
              endDotSize: 4,
            },
          }}
        />
      </Panel>
    </Chart>
  );
}

export default CustomLayerChart;
