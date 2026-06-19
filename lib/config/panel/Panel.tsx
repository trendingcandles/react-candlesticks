/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ReactNode } from 'react';
import { PanelConfig } from './PanelConfig';

export interface PanelProps extends Omit<PanelConfig, 'layers' | 'drawings'> {
  children?: ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Panel = (_props: PanelProps) => {

  return null;

};

export default Panel;
