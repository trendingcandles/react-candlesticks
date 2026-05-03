/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { CandlestickLayerConfig } from './CandlestickLayerConfig';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CandlesticksProps extends Omit<CandlestickLayerConfig, 'type'> {
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CandlesticksLayer = (_props: CandlesticksProps) => {

  return null;

};

(CandlesticksLayer as typeof CandlesticksLayer & { layerType?: string }).layerType = 'price:candlesticks';
CandlesticksLayer.displayName = 'CandlesticksLayer';

export default CandlesticksLayer;
