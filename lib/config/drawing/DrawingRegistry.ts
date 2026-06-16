/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { CustomDrawingDefinition } from '../../drawings/defineDrawing';

export type DrawingRegistry = Readonly<Record<string, CustomDrawingDefinition>>;
