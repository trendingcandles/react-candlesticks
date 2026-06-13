import { describe, expect, it } from 'vitest';

import ATRLayer from '../atr/ATRLayer';
import BollingerBandsLayer from '../bollingerBands/BollingerBandsLayer';
import EMALayer from '../ema/EMALayer';
import MACDLayer from '../macd/MACDLayer';
import RSILayer from '../rsi/RSILayer';
import ADXLayer from '../adx/ADXLayer';
import CCILayer from '../cci/CCILayer';
import OBVLayer from '../obv/OBVLayer';
import ParabolicSARLayer from '../parabolicSar/ParabolicSARLayer';
import WilliamsRLayer from '../williamsR/WilliamsRLayer';

describe('indicator layer components', () => {
  it('all indicator layer components return null placeholders', () => {
    expect(ATRLayer({} as never)).toBeNull();
    expect(BollingerBandsLayer({} as never)).toBeNull();
    expect(EMALayer({} as never)).toBeNull();
    expect(MACDLayer({} as never)).toBeNull();
    expect(RSILayer({} as never)).toBeNull();
    expect(ADXLayer({} as never)).toBeNull();
    expect(CCILayer({} as never)).toBeNull();
    expect(OBVLayer({} as never)).toBeNull();
    expect(ParabolicSARLayer({} as never)).toBeNull();
    expect(WilliamsRLayer({} as never)).toBeNull();
  });
});
