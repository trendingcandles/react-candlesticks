import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { StatefulChartProps } from '../../StatefulChart/StatefulChart';
import {
  ADX,
  ATR,
  BollingerBands,
  Candlesticks,
  Chart,
  EMA,
  MACD,
  Panel,
  PriceLine,
  RSI,
  SMA,
  Stochastic,
  VolumeBars,
  exampleData,
} from '../../../index';

let capturedProps: StatefulChartProps | null = null;

vi.mock('../../../hooks/useResizeObserver', () => ({
  default: () => [{ width: 800, height: 600 }, { current: null }],
}));
vi.mock('../../../hooks/useDevicePixelRatio', () => ({ default: () => 1 }));
vi.mock('../../StatefulChart', () => ({
  default: (props: StatefulChartProps) => {
    capturedProps = props;
    return <div data-testid="stateful-chart" />;
  },
}));

describe('Chart all layers render', () => {
  it('renders a chart with all layer types using minimal props', () => {
    render(
      <Chart data={exampleData} granularity="d1">
        <Panel heightRatio={3}>
          <Candlesticks />
          <PriceLine />
          <VolumeBars />
          <SMA />
          <EMA />
          <BollingerBands />
        </Panel>
        <Panel>
          <ADX />
        </Panel>
        <Panel>
          <ATR />
        </Panel>
        <Panel>
          <MACD />
        </Panel>
        <Panel>
          <RSI />
        </Panel>
        <Panel>
          <Stochastic />
        </Panel>
      </Chart>,
    );

    expect(capturedProps).toBeTruthy();
    expect(capturedProps?.panels).toHaveLength(6);
    expect(capturedProps?.panels[0]?.layers).toHaveLength(6);
    expect(capturedProps?.panels[1]?.layers).toHaveLength(1);
    expect(capturedProps?.panels[2]?.layers).toHaveLength(1);
    expect(capturedProps?.panels[3]?.layers).toHaveLength(1);
    expect(capturedProps?.panels[4]?.layers).toHaveLength(1);
    expect(capturedProps?.panels[5]?.layers).toHaveLength(1);
  });
});
