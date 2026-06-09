import { describe, expect, it } from 'vitest';

import ATRLayer from '../atr/ATRLayer';
import BollingerBandsLayer from '../bollingerBands/BollingerBandsLayer';
import EMALayer from '../ema/EMALayer';
import MACDLayer from '../macd/MACDLayer';
import RSILayer from '../rsi/RSILayer';
import ADXLayer from '../adx/ADXLayer';

describe('indicator layer components', () => {
  it('all indicator layer components return null placeholders', () => {
    expect(ATRLayer({} as never)).toBeNull();
    expect(BollingerBandsLayer({} as never)).toBeNull();
    expect(EMALayer({} as never)).toBeNull();
    expect(MACDLayer({} as never)).toBeNull();
    expect(RSILayer({} as never)).toBeNull();
    expect(ADXLayer({} as never)).toBeNull();
  });
});
