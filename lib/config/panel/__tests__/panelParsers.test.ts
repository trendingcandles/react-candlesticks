import { describe, expect, it } from 'vitest';
import parsePanelControlsConfig from '../controls/parsePanelControlsConfig';
import parsePanelConfig from '../parsePanelConfig';
import parsePanelConfigs from '../parsePanelConfigs';
import setPanelYAxes from '../setPanelYAxes';
import createLayerTopology from '../../layer/createLayerTopology';
import Panel from '../Panel';
import defaultLightTheme from '../../../themes/defaultLightTheme';
import * as config from '../../index';

describe('panel parsers', () => {
  it('parses panel controls', () => {
    const controls = parsePanelControlsConfig({}, defaultLightTheme.panels.controls);
    expect(controls.goToLatestButton).toBeNull();
  });

  it('parses panel config and validates numeric fields', () => {
    expect(() => parsePanelConfig({ layers: [{ type: 'price:line' }], heightRatio: 0 } as never, defaultLightTheme, 0)).toThrow('panel_0.heightRatio must be > 0');

    const parsed = parsePanelConfig({ id: 'main', layers: [{ type: 'price:line' }] } as never, defaultLightTheme, 0);
    expect(parsed.id).toBe('main');
    expect(parsed.layers).toHaveLength(1);
  });

  it('parses panel configs, detects duplicate ids, and sets yAxes', () => {
    const panels = parsePanelConfigs([
      { id: 'a', layers: [{ type: 'price:line' }] },
      { id: 'b', layers: [{ type: 'sma' }] },
    ] as never, defaultLightTheme);
    const topology = createLayerTopology(panels as never);
    const withYAxes = setPanelYAxes(panels as never, topology);
    expect(withYAxes[0].yAxes.leftTotalWidth + withYAxes[0].yAxes.rightTotalWidth).toBeGreaterThan(0);

    expect(() => parsePanelConfigs([
      { id: 'dup', layers: [{ type: 'price:line' }] },
      { id: 'dup', layers: [{ type: 'sma' }] },
    ] as never, defaultLightTheme)).toThrow('Duplicate panel ids found');
  });

  it('exports Panel from config index and Panel component returns null', () => {
    expect(config.Panel).toBe(Panel);
    expect(Panel({ children: null })).toBeNull();
  });
});
