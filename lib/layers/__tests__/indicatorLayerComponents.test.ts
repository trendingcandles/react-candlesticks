import { describe, expect, it } from 'vitest';

import {
  ADX,
  ATR,
  BollingerBands,
  CCI,
  EMA,
  MACD,
  OBV,
  ParabolicSAR,
  RSI,
  WilliamsR,
} from '..';

describe('indicator layer components', () => {
  it('all indicator layer components return null placeholders', () => {
    expect(ATR({} as never)).toBeNull();
    expect(BollingerBands({} as never)).toBeNull();
    expect(EMA({} as never)).toBeNull();
    expect(MACD({} as never)).toBeNull();
    expect(RSI({} as never)).toBeNull();
    expect(ADX({} as never)).toBeNull();
    expect(CCI({} as never)).toBeNull();
    expect(OBV({} as never)).toBeNull();
    expect(ParabolicSAR({} as never)).toBeNull();
    expect(WilliamsR({} as never)).toBeNull();
  });
});
