import { describe, expect, it } from 'vitest';
import { mapDrawingElementToConfig, mapLayerElementToConfig, mapPanelElementsToConfig } from '../parseConfigComponents';
import parseConfigComponents from '../parseConfigComponents';
import { ADX, ATR, CCI, Candlesticks, EMA, OBV, ParabolicSAR, SMA, WilliamsR } from '../../../layers';
import { FC } from 'react';
import LAYER_COMPONENT_TYPE_KEY from '../../../config/layer/layerComponentTypeKey';
import defineDrawing from '../../../drawings/defineDrawing';

const customDrawing = defineDrawing({
  type: 'custom:test-drawing',
  draw: () => {},
});
const CustomDrawing = customDrawing.Component;

describe('parseConfigComponents', () => {
  it('maps layer element to config and strips children', () => {
    const cfg = mapLayerElementToConfig(<Candlesticks id="l1" />);
    expect(cfg).toMatchObject({ id: 'l1', type: 'price:candlesticks' });
  });

  it('maps acronym-cased indicator layer component names', () => {
    const ema = mapLayerElementToConfig(<EMA id="ema-1" period={20} />);
    const atr = mapLayerElementToConfig(<ATR id="atr-1" period={14} />);
    const adx = mapLayerElementToConfig(<ADX id="adx-1" diLength={14} smoothing={14} />);
    const cci = mapLayerElementToConfig(<CCI id="cci-1" length={20} smoothingLength={14} />);
    const obv = mapLayerElementToConfig(<OBV id="obv-1" smoothingLength={14} />);
    const psar = mapLayerElementToConfig(<ParabolicSAR id="psar-1" start={0.02} increment={0.02} maxValue={0.2} />);
    const williamsR = mapLayerElementToConfig(<WilliamsR id="wr-1" length={14} />);

    expect(ema).toMatchObject({ id: 'ema-1', type: 'ema', period: 20 });
    expect(atr).toMatchObject({ id: 'atr-1', type: 'atr', period: 14 });
    expect(adx).toMatchObject({ id: 'adx-1', type: 'adx', diLength: 14, smoothing: 14 });
    expect(cci).toMatchObject({ id: 'cci-1', type: 'cci', length: 20, smoothingLength: 14 });
    expect(obv).toMatchObject({ id: 'obv-1', type: 'obv', smoothingLength: 14 });
    expect(psar).toMatchObject({ id: 'psar-1', type: 'parabolic-sar', start: 0.02, increment: 0.02, maxValue: 0.2 });
    expect(williamsR).toMatchObject({ id: 'wr-1', type: 'williams-r', length: 14 });
  });

  it('uses static layer metadata when component names are minified', () => {
    const X5: FC<{ id?: string; period?: number }> & { [LAYER_COMPONENT_TYPE_KEY]?: string } = () => null;
    X5[LAYER_COMPONENT_TYPE_KEY] = 'ema';

    const cfg = mapLayerElementToConfig(<X5 id="ema-2" period={9} />);

    expect(cfg).toMatchObject({ id: 'ema-2', type: 'ema', period: 9 });
  });

  it('does not infer layer types from component names alone', () => {
    const CCILayer = () => null;
    expect(() => mapLayerElementToConfig(<CCILayer />)).toThrow('Invalid layer: CCILayer');
  });

  it('throws for unknown layer component name', () => {
    const Unknown = () => null;
    expect(() => mapLayerElementToConfig(<Unknown />)).toThrow('Invalid layer: Unknown');
  });

  it('maps drawing elements to drawing configs', () => {
    const drawing = mapDrawingElementToConfig(<CustomDrawing id="d1" value={123} />);

    expect(drawing).toMatchObject({
      id: 'd1',
      type: 'custom:test-drawing',
      value: 123,
    });
  });

  it('maps panel elements with child layers', () => {
    const panel = <div id="p1"><Candlesticks id="l1" /><SMA id="l2" period={10} /><CustomDrawing id="d1" /></div>;
    const cfg = mapPanelElementsToConfig(panel);

    expect(cfg?.id).toBe('p1');
    expect(cfg?.layers).toHaveLength(2);
    expect(cfg?.layers[1]).toMatchObject({ id: 'l2', type: 'sma', period: 10 });
    expect(cfg?.drawings).toHaveLength(1);
    expect(cfg?.drawings?.[0]).toMatchObject({ id: 'd1', type: 'custom:test-drawing' });
  });

  it('parses top-level chart children into panel configs', () => {
    const result = parseConfigComponents([
      <div key="p1" id="p1"><Candlesticks id="l1" /></div>,
      <div key="p2" id="p2"><SMA id="l2" /></div>,
      'ignore-me',
    ]);

    expect(result).toHaveLength(2);
    expect(result[0].layers[0].type).toBe('price:candlesticks');
    expect(result[1].layers[0].type).toBe('sma');
  });
});
